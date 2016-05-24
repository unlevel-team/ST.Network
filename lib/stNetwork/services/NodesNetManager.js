"use strict";

/*
 Nodes Net manager

 - Provides net management for nodes.
 - Add data channel to node
 - Remove data channel from node
 - Get data channels of node


 */

let DataChannelsManager = require('../DataChannel.js').DataChannelsManager;


/**
 * Nodes net manager
 */
class NodesNetManager extends DataChannelsManager {


	constructor() {
		
		super();

		let nnetm = this;

		nnetm.CONSTANTS.Events.DeleteDCOnNode = "Delete DC on Node";
		nnetm.CONSTANTS.Events.SetDCOptionsOnNode = "Set DC options on Node";
	}


	/**
	 * Add data channel to node
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


		// · · · ^^^ · · ·  ^^^ · · ·  ^^^ · · · ^^^ · · ·  ^^^ · |\/|···
		// Extra config parameters
		if (config !== undefined &&
				config !== null) {

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
		// · · · ^^^ · · ·  ^^^ · · ·  ^^^ · · · ^^^ · · ·  ^^^ · |/\|···


		console.log('<*> ST NodesNetManager.addDataChannelToNode');	// TODO REMOVE DEBUG LOG
		console.log(' <·> Channel ID: ' + dch_Config._dchID);	// TODO REMOVE DEBUG LOG
		console.log(' <·> Node ID:' + dch_Config._nodeID);	// TODO REMOVE DEBUG LOG


		try {
			let dch = DataChannelsManager.get_DataChannel(dch_Config);
			nnetm.addDataChannel(dch);
		} catch (e) {
			throw "Cannot add Datachannel. " + e.message;
		}

	}


	/**
	 * Remove data channel from node
	 */
	removeDataChannelFromNode(node, dchID) {
		let nnetm = this;
		nnetm.removeDataChannel(node.config.nodeID + '.' + dchID);
	}


	/**
	 * Get data channel of node
	 */
	getDataChannelOfNode(nodeID, dchID) {
		let nnetm = this;
		return nnetm.getDataChannelByID(nodeID + '.' + dchID);
	}


	/**
	 * Returns data channels searched by DataChannel.config._nodeID
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

		// Emit event SetDCOptionsOnNode
		nnetm.eventEmitter.emit(nnetm.CONSTANTS.Events.SetDCOptionsOnNode,
				{ "node" : dch.config._node,
					"channelID" : dch.config._dchID,
					"options" : options
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
			var dchConfig = {
					"mode" : null,
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
		console.log(' <·> ' + dch.config.id);	// TODO REMOVE DEBUG LOG

		try {
			nnetm.removeDataChannelFromNode(node, dch.config._dchID);

		} catch (e) {
			// TODO: handle exception
			console.log('<EEE> ST NodesNetManager._deleteDConServer');	// TODO REMOVE DEBUG LOG
			console.log(e.message);	// TODO REMOVE DEBUG LOG
		}

	}


	/**
	 * Delete data channel on node
	 */
	_deleteDConNode(channelID, stNode) {

		let nnetm = this;
		nnetm.eventEmitter.emit(nnetm.CONSTANTS.Events.DeleteDCOnNode, {"node": stNode, "channelID": channelID});	// Emit event DeleteDCOnNode

	}

}


module.exports = NodesNetManager;