"use strict";

/*
 Nodes Net manager

 - Provides net management for nodes.
 - Add data channel to node
 - Remove data channel from node
 - Get data channels of node


 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataChannel = require('../DataChannel.js').DataChannel;
var DataChannelsManager = require('../DataChannel.js').DataChannelsManager;

var NETservices_CONSTANTS = require('./NETservices.js').NETservices_CONSTANTS;

/**
 * Node data channel
 */

var NodeDC = function (_DataChannel) {
	_inherits(NodeDC, _DataChannel);

	function NodeDC(config) {
		_classCallCheck(this, NodeDC);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NodeDC).call(this, config));

		var dc = _this;
		dc.CONSTANTS.NET = NETservices_CONSTANTS;

		if (config.state !== undefined) {
			dc.state = config.state.toString();
		}
		return _this;
	}

	/**
  * Initialize data channel
  */


	_createClass(NodeDC, [{
		key: 'initDataChannel',
		value: function initDataChannel() {

			_get(Object.getPrototypeOf(NodeDC.prototype), 'initDataChannel', this).call(this);

			var dc = this;
			var node = dc.config._node;
			var channelID = dc.config._dchID;

			try {
				var message = {
					"channelID": channelID
				};

				// Emit message initDC
				node.socket.emit(dc.CONSTANTS.NET.Messages.initDC, message);
			} catch (e) {
				// TODO: handle exception
				console.log('<EEE> ST NodesNetService._event_initDCOnNode'); // TODO REMOVE DEBUG LOG
				console.log(e); // TODO REMOVE DEBUG LOG
			}

			console.log('<*> ST NodeDC.initDataChannel'); // TODO REMOVE DEBUG LOG
			console.log(' <~> NodeID: ' + node.config.nodeID); // TODO REMOVE DEBUG LOG
			console.log(' <~> ChannelID: ' + channelID); // TODO REMOVE DEBUG LOG
		}

		/**
   * Close data channel
   */

	}, {
		key: 'closeDataChannel',
		value: function closeDataChannel() {

			_get(Object.getPrototypeOf(NodeDC.prototype), 'closeDataChannel', this).call(this);

			var dc = this;
			var node = dc.config._node;
			var channelID = dc.config._dchID;

			try {
				var message = {
					"channelID": channelID
				};

				// Emit message initDC
				node.socket.emit(dc.CONSTANTS.NET.Messages.closeDC, message);
			} catch (e) {
				// TODO: handle exception
				console.log('<EEE> ST NodeDC.closeDataChannel'); // TODO REMOVE DEBUG LOG
				console.log(e); // TODO REMOVE DEBUG LOG
			}

			console.log('<*> ST NodeDC.closeDataChannel'); // TODO REMOVE DEBUG LOG
			console.log(' <~> NodeID: ' + node.config.nodeID); // TODO REMOVE DEBUG LOG
			console.log(' <~> ChannelID: ' + channelID); // TODO REMOVE DEBUG LOG
		}

		/**
   * Start data channel
   */

	}, {
		key: 'startDataChannel',
		value: function startDataChannel() {

			_get(Object.getPrototypeOf(NodeDC.prototype), 'startDataChannel', this).call(this);

			var dc = this;
			var node = dc.config._node;
			var channelID = dc.config._dchID;

			try {
				var message = {
					"channelID": channelID
				};

				// Emit message startDataChannel
				node.socket.emit(dc.CONSTANTS.NET.Messages.startDataChannel, message);
			} catch (e) {
				// TODO: handle exception
				console.log('<EEE> ST NodeDC.startDataChannel'); // TODO REMOVE DEBUG LOG
				console.log(e); // TODO REMOVE DEBUG LOG
			}

			console.log('<*> ST NodeDC.startDataChannel'); // TODO REMOVE DEBUG LOG
			console.log(' <~> NodeID: ' + node.config.nodeID); // TODO REMOVE DEBUG LOG
			console.log(' <~> ChannelID: ' + channelID); // TODO REMOVE DEBUG LOG
		}

		/**
   * Stop data channel
   */

	}, {
		key: 'stopDataChannel',
		value: function stopDataChannel() {

			_get(Object.getPrototypeOf(NodeDC.prototype), 'stopDataChannel', this).call(this);

			var dc = this;
			var node = dc.config._node;
			var channelID = dc.config._dchID;

			try {
				var message = {
					"channelID": channelID
				};

				// Emit message stopDataChannel
				node.socket.emit(dc.CONSTANTS.NET.Messages.stopDataChannel, message);
			} catch (e) {
				// TODO: handle exception
				console.log('<EEE> ST NodeDC.stopDataChannel'); // TODO REMOVE DEBUG LOG
				console.log(e); // TODO REMOVE DEBUG LOG
			}

			console.log('<*> ST NodeDC.stopDataChannel'); // TODO REMOVE DEBUG LOG
			console.log(' <~> NodeID: ' + node.config.nodeID); // TODO REMOVE DEBUG LOG
			console.log(' <~> ChannelID: ' + channelID); // TODO REMOVE DEBUG LOG
		}
	}]);

	return NodeDC;
}(DataChannel);

/**
 * Nodes net manager
 */


var NodesNetManager = function (_DataChannelsManager) {
	_inherits(NodesNetManager, _DataChannelsManager);

	function NodesNetManager() {
		_classCallCheck(this, NodesNetManager);

		var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(NodesNetManager).call(this));

		var nnetm = _this2;

		nnetm.CONSTANTS.Events.DeleteDCOnNode = "Delete DC on Node";
		nnetm.CONSTANTS.Events.SetDCOptionsOnNode = "Set DC options on Node";

		nnetm.CONSTANTS.Events.initDCOnNode = "Init DC on Node";
		nnetm.CONSTANTS.Events.closeDCOnNode = "Close DC on Node";

		return _this2;
	}

	/**
  * Get Node data channel
  */


	_createClass(NodesNetManager, [{
		key: 'addDataChannelToNode',


		/**
   * Add data channel to node
   */
		value: function addDataChannelToNode(node, dchID, config) {

			var nnetm = this;

			var dch_Config = {
				'id': node.config.nodeID + '.' + dchID,
				'type': nnetm.CONSTANTS.Config.DCtype_socketio,
				'_node': node,
				'_nodeID': node.config.nodeID,
				'_dchID': dchID,
				'_netState': nnetm.CONSTANTS.States.DCstate_Config
			};

			// ~ ~ ~ ^^^ ~ ~ ~  ^^^ ~ ~ ~  ^^^ ~ ~ ~ ^^^ ~ ~ ~  ^^^ ~ |\/|~~~
			// Extra config parameters
			if (config !== undefined && config !== null) {

				if (config.state) {
					dch_Config.state = config.state;
				}

				if (config.mode) {
					dch_Config.mode = config.mode;
				}

				if (config.socketPort) {
					dch_Config.socketPort = config.socketPort;
				}

				if (config.netLocation) {
					dch_Config.netLocation = config.netLocation;
				}

				if (config._synchro) {
					dch_Config._synchro = config._synchro;
				}
			}
			// ~ ~ ~ ^^^ ~ ~ ~  ^^^ ~ ~ ~  ^^^ ~ ~ ~ ^^^ ~ ~ ~  ^^^ ~ |/\|~~~

			console.log('<*> ST NodesNetManager.addDataChannelToNode'); // TODO REMOVE DEBUG LOG
			console.log(' <~> Channel ID: ' + dch_Config._dchID); // TODO REMOVE DEBUG LOG
			console.log(' <~> Node ID:' + dch_Config._nodeID); // TODO REMOVE DEBUG LOG

			try {
				var dch = NodesNetManager.get_NodeDC(dch_Config);
				nnetm.addDataChannel(dch);
			} catch (e) {
				throw "Cannot add Datachannel. " + e;
			}
		}

		/**
   * Remove data channel from node
   */

	}, {
		key: 'removeDataChannelFromNode',
		value: function removeDataChannelFromNode(node, dchID) {
			var nnetm = this;
			nnetm.removeDataChannel(node.config.nodeID + '.' + dchID);
		}

		/**
   * Get data channel of node
   */

	}, {
		key: 'getDataChannelOfNode',
		value: function getDataChannelOfNode(nodeID, dchID) {
			var nnetm = this;
			return nnetm.getDataChannelByID(nodeID + '.' + dchID);
		}

		/**
   * Returns data channels searched by DataChannel.config._nodeID
   */

	}, {
		key: 'getDataChannelsOfNode',
		value: function getDataChannelsOfNode(nodeID) {

			var nnetm = this;

			var nodeDCHs = nnetm.channelsList.filter(function (dch, _i, _items) {

				if (dch.config._nodeID === nodeID) {
					return true;
				}
			});

			return {
				"numDataChannels": nodeDCHs.length,
				"dataChannels": nodeDCHs
			};
		}

		/**
   * Set options of data channel
   */

	}, {
		key: 'setOptionsOfDataChannel',
		value: function setOptionsOfDataChannel(dch, options) {

			var nnetm = this;

			console.log('<*> ST NodesNetManager.setOptionsOfDataChannel'); // TODO REMOVE DEBUG LOG
			console.log(options); // TODO REMOVE DEBUG LOG

			if (dch.config.state !== undefined && dch.config.state !== dch.CONSTANTS.States.DCstate_Config) {
				throw "Bad data channel state";
			}

			// Emit event SetDCOptionsOnNode
			nnetm.eventEmitter.emit(nnetm.CONSTANTS.Events.SetDCOptionsOnNode, { "node": dch.config._node,
				"channelID": dch.config._dchID,
				"options": options
			});
		}

		/**
   * Initialize DC on Node
   */

	}, {
		key: 'initializeDConNode',
		value: function initializeDConNode(dch, node) {

			var nnetm = this;

			console.log('<*> ST NodesNetManager.initializeDConNode'); // TODO REMOVE DEBUG LOG

			if (dch.state !== dch.CONSTANTS.States.DCstate_Config) {
				throw "Bad channel state";
			}

			// Emit event initDCOnNode
			nnetm.eventEmitter.emit(nnetm.CONSTANTS.Events.initDCOnNode, { "node": dch.config._node,
				"channelID": dch.config._dchID
			});
		}

		/**
   * Close DC on Node
   */

	}, {
		key: 'closeDConNode',
		value: function closeDConNode(dch, node) {

			var nnetm = this;

			console.log('<*> ST NodesNetManager.closeDConNode'); // TODO REMOVE DEBUG LOG

			if (dch.state !== dch.CONSTANTS.States.State_Ready) {
				throw "Bad channel state";
			}

			// Emit event closeDCOnNode
			nnetm.eventEmitter.emit(nnetm.CONSTANTS.Events.closeDCOnNode, { "node": dch.config._node,
				"channelID": dch.config._dchID
			});
		}

		/**
   * Create data channel from node
   *
   * Synchronization tasks
   */

	}, {
		key: '_createDCfromNode',
		value: function _createDCfromNode(nodeDCH, node) {

			var nnetm = this;

			console.log('<*> ST NodesNetManager._createDCfromNode'); // TODO REMOVE DEBUG LOG
			console.log(nodeDCH); // TODO REMOVE DEBUG LOG

			// Create data channel from node
			try {
				var dchConfig = {
					"mode": null,
					"state": nodeDCH.state,
					"_synchro": true
				};

				switch (nodeDCH.mode) {
					case "input":
						dchConfig.mode = nnetm.CONSTANTS.Config.modeIN;
						break;

					case "output":
						dchConfig.mode = nnetm.CONSTANTS.Config.modeOUT;
						break;

					default:
						throw "Bad mode.";
					//					break;

				}

				try {
					nnetm.addDataChannelToNode(node, nodeDCH.id, dchConfig);
				} catch (e) {
					throw "Error adding channel. " + e.message;
				}
			} catch (e) {
				// TODO: handle exception
				console.log('<EEE> ST NodesNetManager._createDCfromNode'); // TODO REMOVE DEBUG LOG
				console.log(e.message); // TODO REMOVE DEBUG LOG
			}
		}

		/**
   * Delete data channel on server
   */

	}, {
		key: '_deleteDConServer',
		value: function _deleteDConServer(dch, node) {

			var nnetm = this;

			console.log('<*> ST NodesNetManager._deleteDConServer'); // TODO REMOVE DEBUG LOG
			console.log(' <~> ' + dch.config.id); // TODO REMOVE DEBUG LOG

			try {
				nnetm.removeDataChannelFromNode(node, dch.config._dchID, { "force": true });
			} catch (e) {
				// TODO: handle exception
				console.log('<EEE> ST NodesNetManager._deleteDConServer'); // TODO REMOVE DEBUG LOG
				console.log(e); // TODO REMOVE DEBUG LOG
			}
		}

		/**
   * Delete data channel on node
   */

	}, {
		key: '_deleteDConNode',
		value: function _deleteDConNode(channelID, stNode) {

			var nnetm = this;

			// Emit event DeleteDCOnNode
			nnetm.eventEmitter.emit(nnetm.CONSTANTS.Events.DeleteDCOnNode, { "node": stNode, "channelID": channelID });
		}
	}], [{
		key: 'get_NodeDC',
		value: function get_NodeDC(config) {

			var dataChannel = new NodeDC(config);
			return dataChannel;
		}
	}]);

	return NodesNetManager;
}(DataChannelsManager);

module.exports = NodesNetManager;
//# sourceMappingURL=NodesNetManager.js.map
