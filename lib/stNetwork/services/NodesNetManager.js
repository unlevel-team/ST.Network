"use strict";

/*
 Nodes Net manager

 - Provides net management for nodes.
 - Add data channel to node
 - Remove data channel from node
 - Get data channels of node


 */


/**
 * import DataChannel
 * @ignore
 */
let DataChannel = require('../DataChannel.js').DataChannel;


/**
 * import DataChannelsManager
 * @ignore
 */
let DataChannelsManager = require('../DataChannel.js').DataChannelsManager;

/**
 * import NETservices_CONSTANTS
 * @ignore
 */
let NETservices_CONSTANTS = require('./NETservices.js').NETservices_CONSTANTS;


/**
 * Node data channel
 * 
 * @class
 * @implements DataChannel
 */
class NodeDC extends DataChannel {
	
	/**
	 * @constructs NodeDC
	 * 
	 * @param {object} config - Configuration object
	 */
	constructor(config) {
		
		super(config);
		
		let dc = this;
		dc.CONSTANTS.NET = NETservices_CONSTANTS;
		
		if (config.state !== undefined) {
			dc.state = config.state.toString();
		}
	}
	
	
	/**
	 * Initialize data channel
	 */
	initDataChannel () {
		
		super.initDataChannel();
		
		let dc = this;		
		let node = dc.config._node;
		let channelID = dc.config._dchID;
		
		try {
			let message = {
					"channelID" : channelID
				};
			
			// Emit message initDC 
			node.socket.emit(dc.CONSTANTS.NET.Messages.initDC, message);
			
		} catch (e) {
			// TODO: handle exception
			console.log('<EEE> ST NodesNetService._event_initDCOnNode');	// TODO REMOVE DEBUG LOG
			console.log(e);	// TODO REMOVE DEBUG LOG
		}
		
		console.log('<*> ST NodeDC.initDataChannel');	// TODO REMOVE DEBUG LOG
		console.log(' <~> NodeID: ' + node.config.nodeID);	// TODO REMOVE DEBUG LOG
		console.log(' <~> ChannelID: ' + channelID);	// TODO REMOVE DEBUG LOG

	}
	
	
	/**
	 * Close data channel
	 */
	closeDataChannel() {
			
		super.closeDataChannel();
		
		let dc = this;		
		let node = dc.config._node;
		let channelID = dc.config._dchID;
		
		try {
			let message = {
					"channelID" : channelID
				};
			
			// Emit message initDC 
			node.socket.emit(dc.CONSTANTS.NET.Messages.closeDC, message);
			
		} catch (e) {
			// TODO: handle exception
			console.log('<EEE> ST NodeDC.closeDataChannel');	// TODO REMOVE DEBUG LOG
			console.log(e);	// TODO REMOVE DEBUG LOG
		}
		
		console.log('<*> ST NodeDC.closeDataChannel');	// TODO REMOVE DEBUG LOG
		console.log(' <~> NodeID: ' + node.config.nodeID);	// TODO REMOVE DEBUG LOG
		console.log(' <~> ChannelID: ' + channelID);	// TODO REMOVE DEBUG LOG
		
	}
	
	
	/**
	 * Start data channel
	 */
	startDataChannel() {
			
		super.startDataChannel();
		
		let dc = this;		
		let node = dc.config._node;
		let channelID = dc.config._dchID;
		
		try {
			let message = {
					"channelID" : channelID
				};
			
			// Emit message startDataChannel 
			node.socket.emit(dc.CONSTANTS.NET.Messages.startDataChannel, message);
			
		} catch (e) {
			// TODO: handle exception
			console.log('<EEE> ST NodeDC.startDataChannel');	// TODO REMOVE DEBUG LOG
			console.log(e);	// TODO REMOVE DEBUG LOG
		}
		
		console.log('<*> ST NodeDC.startDataChannel');	// TODO REMOVE DEBUG LOG
		console.log(' <~> NodeID: ' + node.config.nodeID);	// TODO REMOVE DEBUG LOG
		console.log(' <~> ChannelID: ' + channelID);	// TODO REMOVE DEBUG LOG
		
	}
	
	
	/**
	 * Stop data channel
	 */
	stopDataChannel() {
			
		super.stopDataChannel();
		
		let dc = this;		
		let node = dc.config._node;
		let channelID = dc.config._dchID;
		
		try {
			let message = {
					"channelID" : channelID
				};
			
			// Emit message stopDataChannel 
			node.socket.emit(dc.CONSTANTS.NET.Messages.stopDataChannel, message);
			
		} catch (e) {
			// TODO: handle exception
			console.log('<EEE> ST NodeDC.stopDataChannel');	// TODO REMOVE DEBUG LOG
			console.log(e);	// TODO REMOVE DEBUG LOG
		}
		
		console.log('<*> ST NodeDC.stopDataChannel');	// TODO REMOVE DEBUG LOG
		console.log(' <~> NodeID: ' + node.config.nodeID);	// TODO REMOVE DEBUG LOG
		console.log(' <~> ChannelID: ' + channelID);	// TODO REMOVE DEBUG LOG
		
	}
	
}


/**
 * Nodes net manager
 * 
 * @class
 * @implements DataChannelsManager
 */
class NodesNetManager extends DataChannelsManager {

	/**
	 * @constructs NodesNetManager
	 */
	constructor() {
		
		super();

		let nnetm = this;

		nnetm.CONSTANTS.Events.DeleteDCOnNode = "Delete DC on Node";
		nnetm.CONSTANTS.Events.SetDCOptionsOnNode = "Set DC options on Node";
		
		nnetm.CONSTANTS.Events.initDCOnNode = "Init DC on Node";
		nnetm.CONSTANTS.Events.closeDCOnNode = "Close DC on Node";

	}
	
	
	/**
	 * Get Node data channel
	 * 
	 * @param {object} config - Configuration object for DC
	 * @returns {DataChannel}
	 */
	static get_NodeDC(config) {
		
		let dataChannel = new NodeDC(config);
		return dataChannel;
	}


	/**
	 * Add data channel to node
	 * 
	 * @param {object} node - Node
	 * @param {string} dchID - Data channel ID
	 * @param {object} config - Configuration object for DC
	 * 
	 * @throws {Exception}
	 */
	addDataChannelToNode(node, dchID, config) {

		let nnetm = this;

		let dch_Config = {
			'id' : node.config.nodeID + '.' + dchID,
			'type' : nnetm.CONSTANTS.Config.DCtype_socketio,
			'_node' : node,
			'_nodeID' : node.config.nodeID,
			'_dchID' : dchID,
			'_netState' : nnetm.CONSTANTS.States.DCstate_Config
		};


		// ~ ~ ~ ^^^ ~ ~ ~  ^^^ ~ ~ ~  ^^^ ~ ~ ~ ^^^ ~ ~ ~  ^^^ ~ |\/|~~~
		// Extra config parameters
		if (config !== undefined &&
				config !== null) {

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


		console.log('<*> ST NodesNetManager.addDataChannelToNode');	// TODO REMOVE DEBUG LOG
		console.log(' <~> Channel ID: ' + dch_Config._dchID);	// TODO REMOVE DEBUG LOG
		console.log(' <~> Node ID:' + dch_Config._nodeID);	// TODO REMOVE DEBUG LOG


		try {
			let dch = NodesNetManager.get_NodeDC(dch_Config);
			nnetm.addDataChannel(dch);
		} catch (e) {
			throw "Cannot add Datachannel. " + e;
		}

	}

	
	/**
	 * Remove data channel from node
	 * 
	 * @param {object} node - Node
	 * @param {string} dchID - Data channel ID
	 */
	removeDataChannelFromNode(node, dchID ) {
		let nnetm = this;
		nnetm.removeDataChannel(node.config.nodeID + '.' + dchID);
	}


	/**
	 * Get data channel of node
	 * 
	 * @param {string} nodeID - Node ID
	 * @param {string} dchID - Data channel ID
	 */
	getDataChannelOfNode(nodeID, dchID) {
		let nnetm = this;
		return nnetm.getDataChannelByID(nodeID + '.' + dchID);
	}


	/**
	 * Returns data channels searched by DataChannel.config._nodeID
	 * 
	 * @param {string} nodeID - Node ID
	 */
	getDataChannelsOfNode(nodeID){

		let nnetm = this;

		let nodeDCHs = nnetm.channelsList.filter(function(dch, _i, _items) {

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
	setOptionsOfDataChannel(dch, options) {

		let nnetm = this;

		console.log('<*> ST NodesNetManager.setOptionsOfDataChannel');	// TODO REMOVE DEBUG LOG
		console.log(options);	// TODO REMOVE DEBUG LOG

		if (dch.config.state !== undefined &&
				dch.config.state !== dch.CONSTANTS.States.DCstate_Config) {
			throw "Bad data channel state";
		}
		
		// Emit event SetDCOptionsOnNode
		nnetm.eventEmitter.emit(nnetm.CONSTANTS.Events.SetDCOptionsOnNode,
				{ "node" : dch.config._node,
					"channelID" : dch.config._dchID,
					"options" : options
				});

	}
	
	
	/**
	 * Initialize DC on Node
	 */
	initializeDConNode(dch, node) {
		
		let nnetm = this;

		console.log('<*> ST NodesNetManager.initializeDConNode');	// TODO REMOVE DEBUG LOG

		if (dch.state !== dch.CONSTANTS.States.DCstate_Config) {
			throw "Bad channel state";
		}
		
		
		// Emit event initDCOnNode
		nnetm.eventEmitter.emit(nnetm.CONSTANTS.Events.initDCOnNode,
				{ "node" : dch.config._node,
					"channelID" : dch.config._dchID
				});
		
	}

	
	/**
	 * Close DC on Node
	 */	
	closeDConNode(dch, node) {
		
		let nnetm = this;

		console.log('<*> ST NodesNetManager.closeDConNode');	// TODO REMOVE DEBUG LOG

		if (dch.state !== dch.CONSTANTS.States.State_Ready) {
			throw "Bad channel state";
		}
		
		
		// Emit event closeDCOnNode
		nnetm.eventEmitter.emit(nnetm.CONSTANTS.Events.closeDCOnNode,
				{ "node" : dch.config._node,
					"channelID" : dch.config._dchID
				});
		
	}
	

	/**
	 * Create data channel from node
	 *
	 * Synchronization tasks
	 */
	_createDCfromNode(nodeDCH, node) {

		let nnetm = this;

		console.log('<*> ST NodesNetManager._createDCfromNode');	// TODO REMOVE DEBUG LOG
		console.log(nodeDCH);	// TODO REMOVE DEBUG LOG


		// Create data channel from node
		try {
			let dchConfig = {
					"mode" : null,
					"state" : nodeDCH.state,
					"_synchro" : true
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
			console.log('<EEE> ST NodesNetManager._createDCfromNode');	// TODO REMOVE DEBUG LOG
			console.log(e.message);	// TODO REMOVE DEBUG LOG

		}

	}


	/**
	 * Delete data channel on server
	 */
	_deleteDConServer(dch, node) {
		
		let nnetm = this;

		console.log('<*> ST NodesNetManager._deleteDConServer');	// TODO REMOVE DEBUG LOG
		console.log(' <~> ' + dch.config.id);	// TODO REMOVE DEBUG LOG

		try {
			nnetm.removeDataChannelFromNode(node, dch.config._dchID, {"force": true});

		} catch (e) {
			// TODO: handle exception
			console.log('<EEE> ST NodesNetManager._deleteDConServer');	// TODO REMOVE DEBUG LOG
			console.log(e);	// TODO REMOVE DEBUG LOG
		}

	}


	/**
	 * Delete data channel on node
	 */
	_deleteDConNode(channelID, stNode) {

		let nnetm = this;
		
		// Emit event DeleteDCOnNode
		nnetm.eventEmitter.emit(nnetm.CONSTANTS.Events.DeleteDCOnNode, {"node": stNode, "channelID": channelID});	
	}

}


module.exports = NodesNetManager;
