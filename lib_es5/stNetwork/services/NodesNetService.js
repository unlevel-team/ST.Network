"use strict";

/*
 Nodes Net service

 - Provides net service for nodes.
 - Add node to Net service
 - Remove data channel from node
 - Get data channels of node


*/

/**
 * import NETservices_CONSTANTS
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NETservices_CONSTANTS = require('./NETservices.js').NETservices_CONSTANTS;

/**
 * Nodes net service
 * 
 * @class
 * @property {NodesManager} nodesManager - Nodes manager
 * @property {NodesNetManager} nodesNetManager - Nodes Net manager
 * 
 */

var NodesNetService = function () {

	/**
  * 
  * @constructs NodesNetService
  * 
  * @param {NodesManager} nodesManager - Nodes manager
  * @param {NodesNetManager} nodesNetManager - Nodes Net manager
  * 
  */

	function NodesNetService(nodesManager, nodesNetManager) {
		_classCallCheck(this, NodesNetService);

		this.nodesManager = nodesManager;
		this.nodesNetManager = nodesNetManager;

		this.CONSTANTS = NETservices_CONSTANTS;
	}

	/**
  * Initialize
  */


	_createClass(NodesNetService, [{
		key: 'initialize',
		value: function initialize() {

			this._mapControlEvents();
		}

		/**
   * Map control events
   */

	}, {
		key: '_mapControlEvents',
		value: function _mapControlEvents() {

			var nnets = this;
			var nnetm = nnets.nodesNetManager;
			var ndsm = nnets.nodesManager;

			// Map event NodeAdded
			ndsm.eventEmitter.on(ndsm.CONSTANTS.Events.NodeAdded, function (data) {
				nnets.addNode(data.node);
			});

			// Map event DataChannelAdded
			nnetm.eventEmitter.on(nnetm.CONSTANTS.Events.DataChannelAdded, function (data) {
				nnets._event_DataChannelAdded(data, nnets);
			});

			// Map event DataChannelRemoved
			nnetm.eventEmitter.on(nnetm.CONSTANTS.Events.DataChannelRemoved, function (channelID) {

				console.log('<*> ST NodesNetService.DataChannelRemoved'); // TODO REMOVE DEBUG LOG
				console.log(' <~> ChannelID: ' + channelID); // TODO REMOVE DEBUG LOG
			});

			// Map event DeleteDCOnNode
			nnetm.eventEmitter.on(nnetm.CONSTANTS.Events.DeleteDCOnNode, function (data) {

				nnets._deleteDConNode({ "id": data.channelID }, data.node);

				console.log('<*> ST NodesNetService.DeleteDCOnNode'); // TODO REMOVE DEBUG LOG
				console.log(' <~> NodeID: ' + data.node.config.nodeID); // TODO REMOVE DEBUG LOG
				console.log(' <~> ChannelID: ' + data.channelID); // TODO REMOVE DEBUG LOG
			});

			// Map event SetDCOptionsOnNode
			nnetm.eventEmitter.on(nnetm.CONSTANTS.Events.SetDCOptionsOnNode, function (data) {
				nnets._event_SetDCOptionsOnNode(data, nnets);
			});

			// Map event initDCOnNode
			nnetm.eventEmitter.on(nnetm.CONSTANTS.Events.initDCOnNode, function (data) {
				nnets._event_initDCOnNode(data, nnets);
			});
		}

		/**
   * Add node
   */

	}, {
		key: 'addNode',
		value: function addNode(node) {

			var nnets = this;
			var nnetm = nnets.nodesNetManager;
			var ndsm = nnets.nodesManager;

			console.log('<*> ST NodesNetService.addNode'); // TODO REMOVE DEBUG LOG

			var nodeSearch = ndsm.getNodeByID(node.config.nodeID);
			if (nodeSearch.stNode === null) {
				throw "node not found.";
			}

			var stNode = nodeSearch.stNode;

			if (stNode.config._nodesNetService && stNode.config._nodesNetService.active) {
				throw "Node has net service.";
			}

			this._mapControlMessages(stNode);

			if (!stNode.config._nodesNetService) {
				stNode.config._nodesNetService = {
					"active": true
				};
			}

			stNode.socket.emit(nnets.CONSTANTS.Messages.getNetInfo); // Emit message getNetInfo

			console.log('<*> ST NodesNetService.addNode'); // TODO REMOVE DEBUG LOG
			console.log(' <~~~> Message getNetInfo emited.'); // TODO REMOVE DEBUG LOG
		}

		/**
   * Map control messages
   * 
   * @param {object} node - Node object
   * @param {object} socket - Socket object
   */

	}, {
		key: '_mapControlMessages',
		value: function _mapControlMessages(node, socket) {

			var nnets = this;
			var _node = node;

			if (socket === undefined) {
				socket = node.socket;
			}

			console.log('<*> ST NodesNetService._mapControlMessages'); // TODO REMOVE DEBUG LOG

			// Map event disconnect
			socket.on('disconnect', function () {
				socket.removeAllListeners(nnets.CONSTANTS.Messages.getNetInfo);
				socket.removeAllListeners(nnets.CONSTANTS.Messages.NetInfo);
				socket.removeAllListeners(nnets.CONSTANTS.Messages.DataChannelCreated);
				socket.removeAllListeners(nnets.CONSTANTS.Messages.DataChannelDeleted);
				socket.removeAllListeners(nnets.CONSTANTS.Messages.DataChannelOptions);
				socket.removeAllListeners(nnets.CONSTANTS.Messages.DCOptionsUpdated);
				socket.removeAllListeners(nnets.CONSTANTS.Messages.DCInitialized);
				socket.removeAllListeners(nnets.CONSTANTS.Messages.DCClosed);
				socket.removeAllListeners(nnets.CONSTANTS.Messages.DataChannelStarted);
				socket.removeAllListeners(nnets.CONSTANTS.Messages.DataChannelStopped);

				_node.config._nodesNetService.active = false; // Set active property to false
			});

			// Map message getNetInfo
			socket.on(nnets.CONSTANTS.Messages.getNetInfo, function (msg) {
				nnets._msg_getNetInfo(msg, socket, {
					"node": _node.config.nodeID,
					"socket": socket
				});
			});

			// Map message NetInfo
			socket.on(nnets.CONSTANTS.Messages.NetInfo, function (msg) {
				nnets._msg_NetInfo(msg, socket, {
					"node": _node,
					"socket": socket
				});
			});

			// Map message DataChannelCreated
			socket.on(nnets.CONSTANTS.Messages.DataChannelCreated, function (msg) {

				try {
					nnets._msg_DataChannelCreated(msg, socket, {
						"node": _node,
						"nodeID": _node.config.nodeID,
						"channelID": msg.channelID
					});
				} catch (e) {
					// TODO: handle exception
					console.log('<EEE> ST NodesNetService.DataChannelCreated'); // TODO REMOVE DEBUG LOG
					console.log(e); // TODO REMOVE DEBUG LOG
				}
			});

			// Map message DataChannelDeleted
			socket.on(nnets.CONSTANTS.Messages.DataChannelDeleted, function (msg) {

				try {
					nnets._msg_DataChannelDeleted(msg, socket, {
						"node": _node,
						"nodeID": _node.config.nodeID,
						"channelID": msg.channelID
					});
				} catch (e) {
					// TODO: handle exception
					console.log('<EEE> ST NodesNetService.DataChannelDeleted'); // TODO REMOVE DEBUG LOG
					console.log(e); // TODO REMOVE DEBUG LOG
				}
			});

			// Map message DataChannelOptions
			socket.on(nnets.CONSTANTS.Messages.DataChannelOptions, function (msg) {

				try {
					nnets._msg_DataChannelOptions(msg, socket, {
						"node": _node,
						"nodeID": _node.config.nodeID,
						"channelID": msg.channelID,
						"options": msg.options,
						"_nnets": nnets
					});
				} catch (e) {
					// TODO: handle exception
					console.log('<EEE> ST NodesNetService.DataChannelOptions'); // TODO REMOVE DEBUG LOG
					console.log(e); // TODO REMOVE DEBUG LOG
				}
			});

			// Map message DCOptionsUpdated
			socket.on(nnets.CONSTANTS.Messages.DCOptionsUpdated, function (msg) {

				try {
					nnets._msg_DCOptionsUpdated(msg, socket, {
						"node": _node,
						"nodeID": _node.config.nodeID,
						"channelID": msg.channelID
					});
				} catch (e) {
					// TODO: handle exception
					console.log('<EEE> ST NodesNetService.DCOptionsUpdated'); // TODO REMOVE DEBUG LOG
					console.log(e); // TODO REMOVE DEBUG LOG
				}
			});

			// Map message DCInitialized
			socket.on(nnets.CONSTANTS.Messages.DCInitialized, function (msg) {

				try {
					nnets._msg_DCInitialized(msg, socket, {
						"node": _node,
						"nodeID": _node.config.nodeID,
						"channelID": msg.channelID
					});
				} catch (e) {
					// TODO: handle exception
					console.log('<EEE> ST NodesNetService.DCInitialized'); // TODO REMOVE DEBUG LOG
					console.log(e); // TODO REMOVE DEBUG LOG
				}
			});

			// Map message DCClosed
			socket.on(nnets.CONSTANTS.Messages.DCClosed, function (msg) {

				try {
					nnets._msg_DCClosed(msg, socket, {
						"node": _node,
						"nodeID": _node.config.nodeID,
						"channelID": msg.channelID
					});
				} catch (e) {
					// TODO: handle exception
					console.log('<EEE> ST NodesNetService.DCClosed'); // TODO REMOVE DEBUG LOG
					console.log(e); // TODO REMOVE DEBUG LOG
				}
			});

			// Map message DataChannelStarted
			socket.on(nnets.CONSTANTS.Messages.DataChannelStarted, function (msg) {

				try {
					nnets._msg_DataChannelStarted(msg, socket, {
						"node": _node,
						"nodeID": _node.config.nodeID,
						"channelID": msg.channelID
					});
				} catch (e) {
					// TODO: handle exception
					console.log('<EEE> ST NodesNetService.DataChannelStarted'); // TODO REMOVE DEBUG LOG
					console.log(e); // TODO REMOVE DEBUG LOG
				}
			});

			// Map message DataChannelStopped
			socket.on(nnets.CONSTANTS.Messages.DataChannelStopped, function (msg) {

				try {
					nnets._msg_DataChannelStopped(msg, socket, {
						"node": _node,
						"nodeID": _node.config.nodeID,
						"channelID": msg.channelID
					});
				} catch (e) {
					// TODO: handle exception
					console.log('<EEE> ST NodesNetService.DataChannelStopped'); // TODO REMOVE DEBUG LOG
					console.log(e); // TODO REMOVE DEBUG LOG
				}
			});
		}

		/**
   * Event DataChannelAdded
   */

	}, {
		key: '_event_DataChannelAdded',
		value: function _event_DataChannelAdded(data, nnets) {

			if (nnets === undefined) {
				nnets = this;
			}

			var nnetm = nnets.nodesNetManager;
			var ndsm = nnets.nodesManager;

			var channelID = data;

			var channelSearch = nnetm.getDataChannelByID(channelID);
			var dch = channelSearch.dataChannel;
			var node = dch.config._node;

			if (dch.config._synchro) {
				// Data channel added in synchronization process

				dch.config._synchro = null;

				// Emit message getDataChannelOptions
				node.socket.emit(nnets.CONSTANTS.Messages.getDataChannelOptions, { "channelID": dch.config._dchID });
			} else {

				var message = {
					"channelID": dch.config._dchID,
					"mode": dch.config.mode,
					"socketPort": dch.config.socketPort,
					"netLocation": dch.config.netLocation
				};

				// Emit message createDataChannel
				node.socket.emit(nnets.CONSTANTS.Messages.createDataChannel, message);

				console.log('<*> ST NodesNetService.createDataChannel'); // TODO REMOVE DEBUG LOG
				console.log(message); // TODO REMOVE DEBUG LOG
			}

			console.log('<*> ST NodesNetService.DataChannelAdded'); // TODO REMOVE DEBUG LOG
		}

		/**
   * Set options of data channel on node
   */

	}, {
		key: '_event_SetDCOptionsOnNode',
		value: function _event_SetDCOptionsOnNode(data, nnets) {

			if (nnets === undefined) {
				nnets = this;
			}

			var nnetm = nnets.nodesNetManager;

			var node = data.node;
			var channelID = data.channelID;
			var options = data.options;

			console.log('<*> ST NodesNetService._event_SetDCOptionsOnNode'); // TODO REMOVE DEBUG LOG
			console.log(channelID); // TODO REMOVE DEBUG LOG

			try {
				var message = {
					"channelID": channelID,
					"options": options
				};

				node.socket.emit(nnets.CONSTANTS.Messages.SetDCOptions, message); // Emit message SetDCOptions
			} catch (e) {
				// TODO: handle exception
				console.log('<EEE> ST NodesNetService._event_SetDCOptionsOnNode'); // TODO REMOVE DEBUG LOG
				console.log(e); // TODO REMOVE DEBUG LOG
			}

			console.log('<*> ST NodesNetService.SetDCOptionsOnNode'); // TODO REMOVE DEBUG LOG
			console.log(' <~> NodeID: ' + node.config.nodeID); // TODO REMOVE DEBUG LOG
			console.log(' <~> ChannelID: ' + channelID); // TODO REMOVE DEBUG LOG
			console.log(' <~> Options: ' + options); // TODO REMOVE DEBUG LOG
		}

		/**
   * Initialize data channel on node
   */

	}, {
		key: '_event_initDCOnNode',
		value: function _event_initDCOnNode(data, nnets) {

			if (nnets === undefined) {
				nnets = this;
			}

			var nnetm = nnets.nodesNetManager;

			var node = data.node;
			var channelID = data.channelID;

			console.log('<*> ST NodesNetService._event_initDCOnNode'); // TODO REMOVE DEBUG LOG
			console.log(channelID); // TODO REMOVE DEBUG LOG

			try {
				var message = {
					"channelID": channelID
				};

				// Emit message initDC
				node.socket.emit(nnets.CONSTANTS.Messages.initDC, message);
			} catch (e) {
				// TODO: handle exception
				console.log('<EEE> ST NodesNetService._event_initDCOnNode'); // TODO REMOVE DEBUG LOG
				console.log(e); // TODO REMOVE DEBUG LOG
			}

			console.log('<*> ST NodesNetService.SetDCOptionsOnNode'); // TODO REMOVE DEBUG LOG
			console.log(' <~> NodeID: ' + node.config.nodeID); // TODO REMOVE DEBUG LOG
			console.log(' <~> ChannelID: ' + channelID); // TODO REMOVE DEBUG LOG
		}

		/**
   * Message getNetInfo
   */

	}, {
		key: '_msg_getNetInfo',
		value: function _msg_getNetInfo(msg, socket, options) {

			var nnets = this;
			var message = {};

			console.log('<*> ST NodesNetService._msg_getNetInfo'); // TODO REMOVE DEBUG LOG
			console.log(msg); // TODO REMOVE DEBUG LOG

			var dcSearch = nnets.nodesNetManager.getDataChannelsOfNode(options.node);
			message.numDataChannels = dcSearch.numDataChannels;

			if (dcSearch.numDataChannels > 0) {
				message.dataChannels = [];

				dcSearch.dataChannels.forEach(function (dch, _i) {
					var channelInfo = {
						"id": dch.config._dchID,
						"mode": dch.config.mode,
						"type": dch.config.type
					};
					message.dataChannels.push(channelInfo);
				});
			}

			// Emit message NetInfo
			socket.emit(nnets.CONSTANTS.Messages.NetInfo, message);
		}

		/**
   * Message NetInfo
   */

	}, {
		key: '_msg_NetInfo',
		value: function _msg_NetInfo(msg, socket, options) {

			var nnets = this;
			var node = options.node;

			console.log('<*> ST NodesNetService._msg_NetInfo'); // TODO REMOVE DEBUG LOG
			console.log(msg); // TODO REMOVE DEBUG LOG

			if (!node.config._nodesNetService.active) {
				nnets._synchroNodeChannels(node, msg.dataChannels, false);
				node.config._nodesNetService.active = true;
			} else {
				nnets._synchroNodeChannels(node, msg.dataChannels, true);
			}
		}

		/**
   * Message DataChannelCreated
   */

	}, {
		key: '_msg_DataChannelCreated',
		value: function _msg_DataChannelCreated(msg, socket, options) {

			var nnets = this;
			var nnetm = nnets.nodesNetManager;
			var stNode = options.node;

			console.log('<*> ST NodesNetService._msg_DataChannelCreated'); // TODO REMOVE DEBUG LOG
			console.log(msg); // TODO REMOVE DEBUG LOG
			//		console.log(options);	// TODO REMOVE DEBUG LOG

			var dcSearch = nnetm.getDataChannelOfNode(options.nodeID, options.channelID);
			if (dcSearch.dataChannel === null) {
				throw "Data channel not found.";
			}

			var dch = dcSearch.dataChannel;

			if (dch.config._netState === undefined || dch.config._netState !== nnetm.CONSTANTS.States.DCstate_Config) {
				throw "Bad Data channel state.";
			}

			dch.config._netState = dch.CONSTANTS.States.DCstate_Ready;

			stNode.socket.emit(nnetm.CONSTANTS.Messages.getDataChannelOptions, { "channelID": options.channelID }); // Emit message getDataChannelOptions
		}

		/**
   * Message DataChannelDeleted
   */

	}, {
		key: '_msg_DataChannelDeleted',
		value: function _msg_DataChannelDeleted(msg, socket, options) {

			var nnets = this;
			var nnetm = nnets.nodesNetManager;

			console.log('<*> ST NodesNetService._msg_DataChannelDeleted'); // TODO REMOVE DEBUG LOG
			console.log(msg); // TODO REMOVE DEBUG LOG
			console.log(options); // TODO REMOVE DEBUG LOG

			try {
				nnetm.removeDataChannelFromNode(options.node, msg.channelID);
			} catch (e) {
				// TODO: handle exception
				console.log('<EEE> ST NodesNetService._msg_DataChannelDeleted'); // TODO REMOVE DEBUG LOG
				console.log(e); // TODO REMOVE DEBUG LOG
			}
		}

		/**
   * Message DataChannelOptions
   */

	}, {
		key: '_msg_DataChannelOptions',
		value: function _msg_DataChannelOptions(msg, socket, options) {

			var nnets = this;
			var nnetm = nnets.nodesNetManager;
			var node = options.node;

			console.log('<*> ST NodesNetService._msg_DataChannelOptions'); // TODO REMOVE DEBUG LOG
			console.log(msg); // TODO REMOVE DEBUG LOG
			//		console.log(options);	// TODO REMOVE DEBUG LOG

			try {

				var dchSearch = nnetm.getDataChannelOfNode(options.nodeID, options.channelID);
				if (dchSearch.dataChannel === null) {
					throw "Data channel not found.";
				}

				var dch = dchSearch.dataChannel;
				var dchOptions = options.options;

				dch.state = dchOptions.state;
				dch.config._netState = dchOptions.state;
				dch.config.socketPort = dchOptions.socketPort;
				dch.config.netLocation = dchOptions.netLocation;
			} catch (e) {

				// TODO: handle exception
				console.log('<EEE> ST NodesNetService._msg_DataChannelOptions'); // TODO REMOVE DEBUG LOG
				console.log(e); // TODO REMOVE DEBUG LOG
			}
		}

		/**
   * Message DCOptionsUpdated
   */

	}, {
		key: '_msg_DCOptionsUpdated',
		value: function _msg_DCOptionsUpdated(msg, socket, options) {

			var nnets = this;
			var nnetm = nnets.nodesNetManager;
			var node = options.node;

			console.log('<*> ST NodesNetService._msg_DCOptionsUpdated'); // TODO REMOVE DEBUG LOG
			console.log(msg); // TODO REMOVE DEBUG LOG

			try {

				var dchSearch = nnetm.getDataChannelOfNode(options.nodeID, options.channelID);
				if (dchSearch.dataChannel === null) {
					throw "Data channel not found.";
				}

				var dch = dchSearch.dataChannel;

				var message = {
					"channelID": dch.config._dchID
				};

				// Emit message getDataChannelOptions
				node.socket.emit(nnets.CONSTANTS.Messages.getDataChannelOptions, message);
			} catch (e) {
				// TODO: handle exception
				console.log('<EEE> ST NodesNetService._msg_DCOptionsUpdated'); // TODO REMOVE DEBUG LOG
				console.log(e); // TODO REMOVE DEBUG LOG
			}
		}

		/**
   * Message DCInitialized
   */

	}, {
		key: '_msg_DCInitialized',
		value: function _msg_DCInitialized(msg, socket, options) {

			var nnets = this;
			var nnetm = nnets.nodesNetManager;
			var node = options.node;

			console.log('<*> ST NodesNetService._msg_DCInitialized'); // TODO REMOVE DEBUG LOG
			console.log(msg); // TODO REMOVE DEBUG LOG

			try {

				var dchSearch = nnetm.getDataChannelOfNode(options.nodeID, options.channelID);
				if (dchSearch.dataChannel === null) {
					throw "Data channel not found.";
				}

				var dch = dchSearch.dataChannel;

				dch.state = dch.CONSTANTS.States.DCstate_Ready;
			} catch (e) {
				// TODO: handle exception
				console.log('<EEE> ST NodesNetService._msg_DCInitialized'); // TODO REMOVE DEBUG LOG
				console.log(e); // TODO REMOVE DEBUG LOG
			}
		}

		/**
   * Message DCClosed
   */

	}, {
		key: '_msg_DCClosed',
		value: function _msg_DCClosed(msg, socket, options) {

			var nnets = this;
			var nnetm = nnets.nodesNetManager;
			var node = options.node;

			console.log('<*> ST NodesNetService._msg_DCClosed'); // TODO REMOVE DEBUG LOG
			console.log(msg); // TODO REMOVE DEBUG LOG

			try {

				var dchSearch = nnetm.getDataChannelOfNode(options.nodeID, options.channelID);
				if (dchSearch.dataChannel === null) {
					throw "Data channel not found.";
				}

				var dch = dchSearch.dataChannel;

				dch.state = dch.CONSTANTS.States.DCstate_Config;
			} catch (e) {
				// TODO: handle exception
				console.log('<EEE> ST NodesNetService._msg_DCClosed'); // TODO REMOVE DEBUG LOG
				console.log(e); // TODO REMOVE DEBUG LOG
			}
		}

		/**
   * Message DataChannelStarted
   */

	}, {
		key: '_msg_DataChannelStarted',
		value: function _msg_DataChannelStarted(msg, socket, options) {

			var nnets = this;
			var nnetm = nnets.nodesNetManager;
			var node = options.node;

			console.log('<*> ST NodesNetService._msg_DataChannelStarted'); // TODO REMOVE DEBUG LOG
			console.log(msg); // TODO REMOVE DEBUG LOG

			try {

				var dchSearch = nnetm.getDataChannelOfNode(options.nodeID, options.channelID);
				if (dchSearch.dataChannel === null) {
					throw "Data channel not found.";
				}

				var dch = dchSearch.dataChannel;

				dch.state = dch.CONSTANTS.States.DCstate_Working;
			} catch (e) {
				// TODO: handle exception
				console.log('<EEE> ST NodesNetService._msg_DataChannelStarted'); // TODO REMOVE DEBUG LOG
				console.log(e); // TODO REMOVE DEBUG LOG
			}
		}

		/**
   * Message DataChannelStopped
   */

	}, {
		key: '_msg_DataChannelStopped',
		value: function _msg_DataChannelStopped(msg, socket, options) {

			var nnets = this;
			var nnetm = nnets.nodesNetManager;
			var node = options.node;

			console.log('<*> ST NodesNetService._msg_DataChannelStopped'); // TODO REMOVE DEBUG LOG
			console.log(msg); // TODO REMOVE DEBUG LOG

			try {

				var dchSearch = nnetm.getDataChannelOfNode(options.nodeID, options.channelID);
				if (dchSearch.dataChannel === null) {
					throw "Data channel not found.";
				}

				var dch = dchSearch.dataChannel;

				dch.state = dch.CONSTANTS.States.DCstate_Ready;
			} catch (e) {
				// TODO: handle exception
				console.log('<EEE> ST NodesNetService._msg_DataChannelStopped'); // TODO REMOVE DEBUG LOG
				console.log(e); // TODO REMOVE DEBUG LOG
			}
		}

		/**
   * Create data channel on node
   */

	}, {
		key: '_createDConNode',
		value: function _createDConNode(dch, node) {

			var nnets = this;
			var nnetm = nnets.nodesNetManager;

			console.log('<*> ST NodesNetService._createDConNode'); // TODO REMOVE DEBUG LOG

			var message = {
				"channelID": dch.config._dchID,
				"mode": dch.config.mode,
				"socketPort": dch.config.socketPort,
				"netLocation": dch.config.netLocation
			};

			node.socket.emit(nnetm.CONSTANTS.Messages.createDataChannel, message); // Emit message createDataChannel
			console.log(' <~> ST NodesNetService.createDataChannel'); // TODO REMOVE DEBUG LOG
			console.log(message); // TODO REMOVE DEBUG LOG
		}

		/**
   * Delete data channel on node
   */

	}, {
		key: '_deleteDConNode',
		value: function _deleteDConNode(nodeDCH, node) {

			var nnets = this;
			var nnetm = nnets.nodesNetManager;

			console.log('<*> ST NodesNetService._deleteDConNode'); // TODO REMOVE DEBUG LOG
			console.log(nodeDCH); // TODO REMOVE DEBUG LOG

			try {
				var message = {
					"channelID": nodeDCH.id,
					"synchro": true
				};

				node.socket.emit(nnets.CONSTANTS.Messages.deleteDataChannel, message); // Emit message deleteDataChannel
			} catch (e) {
				// TODO: handle exception
				console.log('<EEE> ST NodesNetService._deleteDConNode'); // TODO REMOVE DEBUG LOG
				console.log(e.message); // TODO REMOVE DEBUG LOG
			}
		}

		/**
   * Synchronize node channels
   */

	}, {
		key: '_synchroNodeChannels',
		value: function _synchroNodeChannels(node, dchnlistOfNode, fromNode) {

			var nnets = this;
			var nnetm = this.nodesNetManager;

			if (fromNode === undefined) {
				fromNode = false;
			}

			var dcSearch = nnetm.getDataChannelsOfNode(node.config.nodeID); // Search data channels of node

			console.log('<*> ST NodesNetService._synchroNodeChannels'); // TODO REMOVE DEBUG LOG
			console.log(dchnlistOfNode); // TODO REMOVE DEBUG LOG
			console.log(fromNode); // TODO REMOVE DEBUG LOG
			console.log(dcSearch); // TODO REMOVE DEBUG LOG

			if (dcSearch.numDataChannels === 0) {
				// No data channels for node

				if (fromNode) {
					dchnlistOfNode.forEach(function (_dchOfNode, _i) {
						nnetm._createDCfromNode(_dchOfNode, node); // Create data channel from node
					});
				} else {
						dchnlistOfNode.forEach(function (_dchOfNode, _i) {
							nnets._deleteDConNode(_dchOfNode, node); // Delete data channel on node
						});
					}
			} else {

					dchnlistOfNode.forEach(function (_dchOfNode, _i) {
						// Check channel list provided by node
						var chSearch = nnetm.getDataChannelByID(_dchOfNode.id);
						if (!chSearch.dataChannel) {
							if (fromNode) {
								nnetm._createDCfromNode(_dchOfNode, node); // Create data channel from node
							} else {
									chSearch.dataChannel._synchroOP = "deleteOnNode";
									nnets._deleteDConNode(_dchOfNode, node); // Delete data channel on node
								}
						}
					});

					dcSearch.dataChannels.forEach(function (_dch, _i) {
						// Check the rest of the channels

						if (!_dch._synchroOP) {
							if (fromNode) {
								_dch._synchroOP = "deleteOnServer";
							} else {
								_dch._synchroOP = "createOnNode";
							}
						}
					});

					dcSearch.dataChannels.forEach(function (_dch, _i) {
						// Do synchronization tasks

						switch (_dch._synchroOP) {
							case "createOnNode":
								nnets._createDConNode(_dch, node);
								break;
							case "deleteOnServer":
								_dch.state = _dch.CONSTANTS.States.DCstate_Config;
								nnetm._deleteDConServer(_dch, node);
								break;

							default:
								break;
						}
					});
				}
		}
	}]);

	return NodesNetService;
}();

var NodesNetService_Lib = {
	"NodesNetService": NodesNetService

};

module.exports = NodesNetService_Lib;
//# sourceMappingURL=NodesNetService.js.map
