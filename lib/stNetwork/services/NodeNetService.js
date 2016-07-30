"use strict";


/*
 Node Net service

 - Provides net service for node.
 - Add node to Net service
 - Remove data channel from node
 - Get data channels of node


*/


/**
 * import NETservices_CONSTANTS
 * @ignore
 */
let NETservices_CONSTANTS = require('./NetServices.js').NETservices_CONSTANTS;


/**
 * Node net service
 * 
 * @class
 * @memberof st.net.services
 * @property {object} node - Node
 * @property {st.net.services.NodeNetManager} nodeNetManager - Node Net manager
 * 
 */
class NodeNetService {
	
	/**
	 * @constructs NodeNetService
	 * 
	 * @param {object} node - Node
	 * @param {st.net.services.NodeNetManager} nodeNetManager - Node Net manager
	 */
	constructor(node, nodeNetManager) {
		
		this.node = node;
		this.nodeNetManager = nodeNetManager;
		
		this.CONSTANTS = NETservices_CONSTANTS;
		
	}
	
	/**
	 * Initialize
	 */
	initialize() {
		
		this._mapControlEvents();
		
	}
	
	
	/**
	 * Map control events
	 */
	_mapControlEvents() {
		
		let nnets = this;
		let nnetm = nnets.nodeNetManager;
		let node = nnetm.config._node;
		let nodeCtrlSrv = node.nodeControlService;
		
		// Map event ConnectedToServer
		nodeCtrlSrv.eventEmitter.on(nodeCtrlSrv.CONSTANTS.Events.ConnectedToServer, function() {
			if (!nnets._mapControlMessages_OK) {
				nnets._mapControlMessages(node, node.socket);
			}
		});
		
		
		// Map event DataChannelAdded
		nnetm.eventEmitter.on(nnetm.CONSTANTS.Events.DataChannelAdded, function(data){
			nnets._event_DataChannelAdded(data, nnets);
		});
		
		// Map event DataChannelRemoved
		nnetm.eventEmitter.on(nnetm.CONSTANTS.Events.DataChannelRemoved, function(data) {
			nnets._event_DataChannelRemoved(data, nnets);
		});
		
		// Map event ChannelInitialized
		nnetm.eventEmitter.on(nnetm.CONSTANTS.Events.ChannelInitialized, function(data){
			nnets._event_ChannelInitialized(data, nnets);
		});
		
		// Map event ChannelStarted
		nnetm.eventEmitter.on(nnetm.CONSTANTS.Events.ChannelStarted, function(data){
			nnets._event_ChannelStarted(data, nnets);
		});
		
		// Map event ChannelStopped
		nnetm.eventEmitter.on(nnetm.CONSTANTS.Events.ChannelStopped, function(data){
			nnets._event_ChannelStopped(data, nnets);
		});
		
		// Map event ChannelClosed
		nnetm.eventEmitter.on(nnetm.CONSTANTS.Events.ChannelClosed, function(data){
			nnets._event_ChannelClosed(data, nnets);
		});
		
	}
	
	
	/**
	 * Map control messages
	 * 
	 * @param {object} node - Node
	 * @param {object} socket - Socket object
	 */
	_mapControlMessages(node, socket) {
		let nnets = this;
		let _node = node;
		let nodeCtrlSrv = _node.nodeControlService;
		let nodeConfig = _node.nodeConfiguration.config;

		
		if (socket === undefined) {
			socket = nodeCtrlSrv.socket;
		}
		
		
		nnets._mapControlMessages_OK = true;
		
		// Map event disconnect 
		socket.on('disconnect', function(){
			socket.removeAllListeners(nnets.CONSTANTS.Messages.getNetInfo);
			socket.removeAllListeners(nnets.CONSTANTS.Messages.NetInfo);
			socket.removeAllListeners(nnets.CONSTANTS.Messages.createDataChannel);
			socket.removeAllListeners(nnets.CONSTANTS.Messages.deleteDataChannel);
			socket.removeAllListeners(nnets.CONSTANTS.Messages.getDataChannelOptions);
			socket.removeAllListeners(nnets.CONSTANTS.Messages.SetDCOptions);
			socket.removeAllListeners(nnets.CONSTANTS.Messages.initDC);
			socket.removeAllListeners(nnets.CONSTANTS.Messages.closeDC);


//			_node.config._nodesNetService = null;
			nnets._mapControlMessages_OK = null;

		  });
		
		// Map message getNetInfo
		socket.on(nnets.CONSTANTS.Messages.getNetInfo, function(msg){
			nnets._msg_getNetInfo(msg, socket, {
				"node" : nodeConfig.nodeID,
				"socket" : socket
			});
		  });
		
//		// Map message NetInfo
//		socket.on(nnets.CONSTANTS.Messages.NetInfo, function(msg){
//			nnets._msg_getNetInfo(msg, socket, {
//				"node" : _node.config.nodeID,
//				"socket" : socket
//			});
//		  });
		
		// Map message createDataChannel
		socket.on(nnets.CONSTANTS.Messages.createDataChannel, function(msg){
			nnets._msg_createDataChannel(msg, socket, msg);
		  });	
	
		// Map message deleteDataChannel
		socket.on(nnets.CONSTANTS.Messages.deleteDataChannel, function(msg){
			nnets._msg_deleteDataChannel(msg, socket, {
				"node" : _node,
				"nodeID" : nodeConfig.nodeID,
				"channelID" : msg.channelID
			});
		  });	
		
		// Map message getDataChannelOptions
		socket.on(nnets.CONSTANTS.Messages.getDataChannelOptions, function(msg){
			nnets._msg_getDataChannelOptions(msg, socket, {
				"node" : _node,
				"nodeID" : nodeConfig.nodeID,
				"channelID": msg.channelID
			});
		  });	
		
		// Map message SetDCOptions
		socket.on(nnets.CONSTANTS.Messages.SetDCOptions, function(msg){
			nnets._msg_SetDCOptions(msg, socket, {
				"node" : _node,
				"nodeID" : nodeConfig.nodeID,
				"channelID" : msg.channelID,
				"options" : msg.options
			});
		  });
		
		
		// Map message initDC
		socket.on(nnets.CONSTANTS.Messages.initDC, function(msg){
			nnets._msg_initDC(msg, socket, {
				"node" : _node,
				"nodeID" : nodeConfig.nodeID,
				"channelID" : msg.channelID
			});
		  });
		
		
		// Map message closeDC
		socket.on(nnets.CONSTANTS.Messages.closeDC, function(msg){
			nnets._msg_closeDC(msg, socket, {
				"node" : _node,
				"nodeID" : nodeConfig.nodeID,
				"channelID" : msg.channelID
			});
		  });
		
		
		// Map message startDataChannel
		socket.on(nnets.CONSTANTS.Messages.startDataChannel, function(msg){
			nnets._msg_startDataChannel(msg, socket, {
				"node" : _node,
				"nodeID" : nodeConfig.nodeID,
				"channelID" : msg.channelID
			});
		  });
		
		// Map message stopDataChannel
		socket.on(nnets.CONSTANTS.Messages.stopDataChannel, function(msg){
			nnets._msg_stopDataChannel(msg, socket, {
				"node" : _node,
				"nodeID" : nodeConfig.nodeID,
				"channelID" : msg.channelID
			});
		  });
		
		
		console.log('<*> ST NodeNetService._mapControlMessages');	// TODO REMOVE DEBUG LOG

	}
	
	
	/**
	 * Event DataChannelAdded
	 */
	_event_DataChannelAdded(data, nnets) {
		
		if (nnets === undefined) {
			nnets = this;
		}
		
		let nnetm = nnets.nodeNetManager;
		let node = nnetm.config._node;
		let nodeCtrlSrv = node.nodeControlService;
		
		let channelID = data;
		
		let channelSearch = nnetm.getDataChannelByID(channelID);
		let dch = channelSearch.dataChannel;
		
		let message = {
			"channelID" : dch.config.id,
			"_chnID" : dch.config._dchID,
			"mode" : dch.config.mode,
			"socketPort" : dch.config.socketPort,
			"netLocation" : dch.config.netLocation
		};
		
		// Emit message DataChannelCreated
		nodeCtrlSrv.socket.emit(nnets.CONSTANTS.Messages.DataChannelCreated, message); 
		
		console.log('<*> ST NodeNetService._event_DataChannelAdded');	// TODO REMOVE DEBUG LOG
		console.log(message);	// TODO REMOVE DEBUG LOG
		
	}
	
	
	/**
	 * Event DataChannelRemoved
	 */
	_event_DataChannelRemoved(data, nnets) {
		
		if (nnets === undefined) {
			nnets = this;
		}
		
		let nnetm = nnets.nodeNetManager;
		let node = nnetm.config._node;
		let nodeCtrlSrv = node.nodeControlService;
		
		let channelID = data;
	
		let message = {
				"channelID" : channelID
			};
			
		// Emit message DataChannelDeleted
		nodeCtrlSrv.socket.emit(nnets.CONSTANTS.Messages.DataChannelDeleted, message); 
		
		console.log('<*> ST NodeNetService._event_DataChannelRemoved');	// TODO REMOVE DEBUG LOG
		console.log(message);	// TODO REMOVE DEBUG LOG
		
	}
	
	
	/**
	 * Event ChannelInitialized
	 */
	_event_ChannelInitialized(data, nnets) {
		
		if (nnets === undefined) {
			nnets = this;
		}
		
		let nnetm = nnets.nodeNetManager;
		let node = nnetm.config._node;
		let nodeCtrlSrv = node.nodeControlService;
		
		let dch = data.dataChannel;
		
		let message = {
			"channelID" : dch.config.id,
			"_chnID" : dch.config._dchID
		};
		
		// Emit message DCInitialized
		nodeCtrlSrv.socket.emit(nnets.CONSTANTS.Messages.DCInitialized, message); 
		
		console.log('<*> ST NodeNetService._event_ChannelInitialized');	// TODO REMOVE DEBUG LOG
		console.log(message);	// TODO REMOVE DEBUG LOG
		
	}
	
	
	/**
	 * Event ChannelStarted
	 */
	_event_ChannelStarted(data, nnets) {
		
		if (nnets === undefined) {
			nnets = this;
		}
		
		let nnetm = nnets.nodeNetManager;
		let node = nnetm.config._node;
		let nodeCtrlSrv = node.nodeControlService;
		
		let dch = data.dataChannel;
		
		let message = {
			"channelID" : dch.config.id,
			"_chnID" : dch.config._dchID
		};
		
		// Emit message DataChannelStarted
		nodeCtrlSrv.socket.emit(nnets.CONSTANTS.Messages.DataChannelStarted, message); 
		
		console.log('<*> ST NodeNetService._event_ChannelStarted');	// TODO REMOVE DEBUG LOG
		console.log(message);	// TODO REMOVE DEBUG LOG
		
	}
	
	
	/**
	 * Event ChannelStarted
	 */
	_event_ChannelStopped(data, nnets) {
		
		if (nnets === undefined) {
			nnets = this;
		}
		
		let nnetm = nnets.nodeNetManager;
		let node = nnetm.config._node;
		let nodeCtrlSrv = node.nodeControlService;
		
		let dch = data.dataChannel;
		
		let message = {
			"channelID" : dch.config.id,
			"_chnID" : dch.config._dchID
		};
		
		// Emit message DataChannelStarted
		nodeCtrlSrv.socket.emit(nnets.CONSTANTS.Messages.DataChannelStopped, message); 
		
		console.log('<*> ST NodeNetService._event_ChannelStopped');	// TODO REMOVE DEBUG LOG
		console.log(message);	// TODO REMOVE DEBUG LOG
		
	}
	
	
	/**
	 * Event ChannelClosed
	 */
	_event_ChannelClosed(data, nnets) {
		
		if (nnets === undefined) {
			nnets = this;
		}
		
		let nnetm = nnets.nodeNetManager;
		let node = nnetm.config._node;
		let nodeCtrlSrv = node.nodeControlService;
		
		let dch = data.dataChannel;
		
		let message = {
			"channelID" : dch.config.id,
			"_chnID" : dch.config._dchID
		};
		
		// Emit message DCClosed
		nodeCtrlSrv.socket.emit(nnets.CONSTANTS.Messages.DCClosed, message); 
		
		console.log('<*> ST NodeNetService._event_ChannelClosed');	// TODO REMOVE DEBUG LOG
		console.log(message);	// TODO REMOVE DEBUG LOG
		
	}
	
	
	/**
	 * Message getNetInfo
	 */
	_msg_getNetInfo(msg, socket, options){
		
		let nnets = this;
		let nnetm = nnets.nodeNetManager;
		
		console.log('<*> ST NodeNetService._msg_getNetInfo');	// TODO REMOVE DEBUG LOG
		console.log(msg);	// TODO REMOVE DEBUG LOG
		
		let message = {};
		
		message.dataChannels = [];
		
		nnetm.channelsList.forEach(function(dch, _i) {
			var channelInfo = {
					"id" : dch.config.id,
					"mode" : dch.config.mode,
					"type" : dch.config.type,
					"state" : dch.state

				};
			message.dataChannels.push(channelInfo);
		});
		
		
		socket.emit(nnets.CONSTANTS.Messages.NetInfo, message);	// Emit message NetInfo
		
	}
	
	
	/**
	 * Message createDataChannel
	 */
	_msg_createDataChannel(msg, socket, options){
		
		let nnets = this;
		let nnetm = nnets.nodeNetManager;
		
		let message = {};
		
		console.log('<*> ST NodeNetService._msg_createDataChannel');	// TODO REMOVE DEBUG LOG
		console.log(options);	// TODO REMOVE DEBUG LOG
		
		nnetm.addDataChannelToNode(options.channelID, options);
		
	}
	
	
	/**
	 * Message deleteDataChannel
	 */
	_msg_deleteDataChannel(msg, socket, options){
		
		let nnets = this;
		let nnetm = nnets.nodeNetManager;
		var message = {};
		
		console.log('<*> ST NodeNetService._msg_deleteDataChannel');	// TODO REMOVE DEBUG LOG
		console.log(options);	// TODO REMOVE DEBUG LOG
		
		
		try {
			nnetm.removeDataChannelFromNode(options.channelID);
			

		} catch (e) {
			// TODO: handle exception
			console.log('<EEE> ST NodeNetService._msg_deleteDataChannel');	// TODO REMOVE DEBUG LOG
			console.log(e);	// TODO REMOVE DEBUG LOG
		}
		
	}
	
	
	/**
	 * Message getDataChannelOptions
	 */
	_msg_getDataChannelOptions(msg, socket, options){
		
		let nnets = this;
		let nnetm = nnets.nodeNetManager;
		
		console.log('<*> ST NodeNetService._msg_getDataChannelOptions');	// TODO REMOVE DEBUG LOG
		console.log(msg);	// TODO REMOVE DEBUG LOG
		
		try {
			
			let dchSearch = nnetm.getDataChannelByID(options.channelID);
			if (dchSearch.dataChannel === null) {
				throw "Data channel not found";
			}
			
			let dch = dchSearch.dataChannel;
			
			let message = {
				"channelID" : options.channelID,
				"options" : {
					"type" : dch.config.type,
					"mode" : dch.config.mode,
					"state" : dch.state,
					"netstate" : dch.config._netState,
					"loopTime" : dch.config.loopTime,
					"netLocation" : dch.config.netLocation,
					"socketPort" : dch.config.socketPort
				}
			};
			
			socket.emit(nnets.CONSTANTS.Messages.DataChannelOptions, message);	// Emit message DataChannelOptions
			
		} catch (e) {
			// TODO: handle exception
			console.log('<EEE> ST NodeNetService._msg_getDataChannelOptions');	// TODO REMOVE DEBUG LOG
			console.log(e);	// TODO REMOVE DEBUG LOG
		}
		
	}
	
	
	/**
	 * Message SetDCOptions
	 */
	_msg_SetDCOptions(msg, socket, options){
		
		let nnets = this;
		let nnetm = nnets.nodeNetManager;
		
		console.log('<*> ST NodeNetService._msg_SetDCOptions');	// TODO REMOVE DEBUG LOG
		console.log(msg);	// TODO REMOVE DEBUG LOG
		
		try {
			
			let dchSearch = nnetm.getDataChannelByID(options.channelID);
			if (dchSearch.dataChannel === null) {
				throw "Data channel not found";
			}
			
			let dch = dchSearch.dataChannel;
			let _options = options.options;
			
			try {
				nnetm.setDCOptions(dch, _options);
			} catch (e) {
				throw "Cannot set data channel options. " + e;
			}
			
			let message = {
					"channelID" : options.channelID
				};
				
			socket.emit(nnets.CONSTANTS.Messages.DCOptionsUpdated, message);	// Emit message DCOptionsUpdated
			
		} catch (e) {
			console.log('<EEE> ST NodeNetService._msg_SetDCOptions');	// TODO REMOVE DEBUG LOG
			console.log(e);	// TODO REMOVE DEBUG LOG
		}
	
	}
	
	
	/**
	 * Message initDC
	 */
	_msg_initDC(msg, socket, options){
		
		let nnets = this;
		let nnetm = nnets.nodeNetManager;
		
		console.log('<*> ST NodeNetService._msg_initDC');	// TODO REMOVE DEBUG LOG
		console.log(msg);	// TODO REMOVE DEBUG LOG
		
		
		try {
			
			let dchSearch = nnetm.getDataChannelByID(options.channelID);
			if (dchSearch.dataChannel === null) {
				throw "Data channel not found";
			}
			
			let dch = dchSearch.dataChannel;
			
			try {
				
				dch.initDataChannel();
				
			} catch (e) {
				throw "Cannot initialize data channel ." + e;
			}
			
		} catch (e) {
			console.log('<EEE> ST NodeNetService._msg_initDC');	// TODO REMOVE DEBUG LOG
			console.log(e);	// TODO REMOVE DEBUG LOG
		}
		
	}
	
	
	/**
	 * Message closeDC
	 */
	_msg_closeDC(msg, socket, options){
		
		let nnets = this;
		let nnetm = nnets.nodeNetManager;
		
		console.log('<*> ST NodeNetService._msg_closeDC');	// TODO REMOVE DEBUG LOG
		console.log(msg);	// TODO REMOVE DEBUG LOG
		
		
		try {
			
			let dchSearch = nnetm.getDataChannelByID(options.channelID);
			if (dchSearch.dataChannel === null) {
				throw "Data channel not found";
			}
			
			let dch = dchSearch.dataChannel;
			
			try {
				
				dch.closeDataChannel();
				
			} catch (e) {
				throw "Cannot close data channel ." + e;
			}
			
		} catch (e) {
			console.log('<EEE> ST NodeNetService._msg_closeDC');	// TODO REMOVE DEBUG LOG
			console.log(e);	// TODO REMOVE DEBUG LOG
		}
		
	}
	
	
	/**
	 * Message startDataChannel
	 */
	_msg_startDataChannel(msg, socket, options){
		
		let nnets = this;
		let nnetm = nnets.nodeNetManager;
		
		console.log('<*> ST NodeNetService._msg_startDataChannel');	// TODO REMOVE DEBUG LOG
		console.log(msg);	// TODO REMOVE DEBUG LOG
		
		
		try {
			
			let dchSearch = nnetm.getDataChannelByID(options.channelID);
			if (dchSearch.dataChannel === null) {
				throw "Data channel not found";
			}
			
			let dch = dchSearch.dataChannel;
			
			try {
				
				dch.startDataChannel();
				
			} catch (e) {
				throw "Cannot start data channel ." + e;
			}
			
		} catch (e) {
			console.log('<EEE> ST NodeNetService._msg_startDataChannel');	// TODO REMOVE DEBUG LOG
			console.log(e);	// TODO REMOVE DEBUG LOG
		}
		
	}
	
	
	/**
	 * Message stopDataChannel
	 */
	_msg_stopDataChannel(msg, socket, options){
		
		let nnets = this;
		let nnetm = nnets.nodeNetManager;
		
		console.log('<*> ST NodeNetService._msg_stopDataChannel');	// TODO REMOVE DEBUG LOG
		console.log(msg);	// TODO REMOVE DEBUG LOG
		
		
		try {
			
			let dchSearch = nnetm.getDataChannelByID(options.channelID);
			if (dchSearch.dataChannel === null) {
				throw "Data channel not found";
			}
			
			let dch = dchSearch.dataChannel;
			
			try {
				
				dch.stopDataChannel();
				
			} catch (e) {
				throw "Cannot stop data channel ." + e;
			}
			
		} catch (e) {
			console.log('<EEE> ST NodeNetService._msg_stopDataChannel');	// TODO REMOVE DEBUG LOG
			console.log(e);	// TODO REMOVE DEBUG LOG
		}
		
	}
	
	
}


let NodeNetService_Lib = {
		"NodeNetService" : NodeNetService
		
	};

module.exports = NodeNetService_Lib;
