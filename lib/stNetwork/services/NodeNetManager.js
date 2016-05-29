"use strict";

/*
 Node Net manager
 
 - Provides net management for node.
 - Add data channel to node
 - Remove data channel from node
 - Get data channels of node
 
 
 */

let DataChannelsManager = require('../DataChannel.js').DataChannelsManager;


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
		
		let dch_Config = {
			id: dchID,
			type: nnetm.CONSTANTS.Config.DCtype_socketio,
			_nodeID: nodeConfig.node.nodeID,
			_node: node,
			_dchID: nodeConfig.node.nodeID + '.' + dchID,
			_netState: nnetm.CONSTANTS.States.DCstate_Config
		};
		
		
		// @ @ @ ^^^ @ @ @ ^^^ @ @ @ ^^^ @ @ @ ^^^ @ @ @ ^^^ @ @ @ ^^^ @ @ @ ^^^ |\/| ^^^
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
		// @ @ @ ^^^ @ @ @ ^^^ @ @ @ ^^^ @ @ @ ^^^ @ @ @ ^^^ @ @ @ ^^^ @ @ @ ^^^ |/\| ^^^

		
		let dch = DataChannelsManager.get_DataChannel(dch_Config);
		
		nnetm._mapDCcontrolEvents(dch);
		
		nnetm.addDataChannel(dch);
	}
	
	
	/**
	 * Remove data channel from node
	 * 
	 * @dc could be DC.id or DC object
	 */
	removeDataChannelFromNode(dc) {
		
		let nnetm = this;
		
		let dataChannel = null;
		
		
		// check for DC.id or DC object
		if (dc.config !== undefined) {
			dataChannel = dc;
		} else {
			let dchSearch = nnetm.getDataChannelByID(dc);
			if (dchSearch.dataChannel === null){
				throw "Channel not found.";
			}
			dataChannel = dchSearch.dataChannel;
		}
		
		
		let channelID = dataChannel.config.id;
		
		if (dataChannel.state !== dataChannel.CONSTANTS.States.DCstate_Config) {
			throw "Bad channel state.";
		}

		
		nnetm._unMapDCcontrolEvents(dataChannel);
		
		nnetm.removeDataChannel(channelID);
		
	}
	
	
	/**
	 * Map control events for DC
	 */
	_mapDCcontrolEvents(dch) {
		
		let nnetm = this;
		
		// Map event ChannelInitialized
		dch.eventEmitter.on(dch.CONSTANTS.Events.ChannelInitialized, function(data) {
			nnetm._event_ChannelInitialized(data, dch, nnetm);
		});
	}
	
	
	/**
	 * UnMap control events for DC
	 */
	_unMapDCcontrolEvents(dch) {
		
		let nnetm = this;
		
		dch.eventEmitter.removeAllListeners(dch.CONSTANTS.Events.ChannelInitialized);
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
	
	
	/**
	 * Event ChannelInitialized
	 */
	_event_ChannelInitialized(data, dch, nnetm) {
		
		if (nnetm === undefined) {
			nnetm = this;
		}
		
		// Emit event ChannelInitialized
		nnetm.eventEmitter.emit(nnetm.CONSTANTS.Events.ChannelInitialized, 
			{
				"channelID": dch.config.id,
				"dataChannel": dch
			});
		
	}
	
}

module.exports = NodeNetManager;

