"use strict";

/*
 Node Net manager
 
 - Provides net management for node.
 - Add data channel to node
 - Remove data channel from node
 - Get data channels of node
 
 
 */

let DataChannelsManager = require('../DataChannel.js').DataChannelsManager;
//let DataChannelsManager = require('../stNetwork/DataChannel.js').DataChannelsManager;




/**
 * Node net manager
 */
class NodeNetManager extends DataChannelsManager {
	
	
	constructor(config) {
		super();
		this.config = config;

	}
	
	
	/**
	 * Add data channel to node
	 */
	addDataChannelToNode(dchID, config) {
		
		let nnetm = this;
		let node = nnetm.config._node;
		let nodeConfig = node.nodeConfiguration.config;
		
		var dch_Config = {
			id: dchID,
			type: nnetm.CONSTANTS.Config.DCtype_socketio,
			_nodeID: nodeConfig.node.nodeID,
			_node: node,
			_dchID: nodeConfig.node.nodeID + '.' + dchID,
			_netState: nnetm.CONSTANTS.States.DCstate_Config
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
			
		}
		// · · · ^^^ · · ·  ^^^ · · ·  ^^^ · · · ^^^ · · ·  ^^^ · |/\|··· 

		
		var dch = DataChannelsManager.get_DataChannel(dch_Config);
		
		nnetm.addDataChannel(dch);
	}
	
	
	/**
	 * Set data channel options
	 */
	setDCOptions(dch, options) {
		
		let nnetm = this;
		
		if (dch.config.state === dch.CONSTANTS.States.DCstate_Working) {
			throw "Bad data channel state";
		}
		
		if (options.loopTime) {
			dch.config.loopTime = options.loopTime;
		}
		
		if (options.netLocation) {
			dch.config.netLocation = options.netLocation;
		}
		
		if (options.socketPort) {
			dch.config.socketPort = options.socketPort;
		}
		
		
	}
	
	
}

module.exports = NodeNetManager;
