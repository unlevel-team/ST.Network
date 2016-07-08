"use strict";

/*
 Node Net manager
 
 - Provides net management for node.
 - Add data channel to node
 - Remove data channel from node
 - Get data channels of node
 
 
 */


/**
 * import DataChannelsManager
 * @ignore
 */
let DataChannelsManager = require('../DataChannel.js').DataChannelsManager;


/**
 * Node net manager
 * 
 * @class
 * @memberof st.net.services
 * @implements st.net.DataChannelsManager
 */
class NodeNetManager extends DataChannelsManager {
	
	/**
	 * @constructs NodeNetManager
	 * 
	 * @param {object} config - Configuration object
	 */
	constructor(config) {
		super();
		this.config = config;

	}
	
	
	/**
	 * Add data channel to node
	 * 
	 * @param {string} dchID - Data channel ID (DC.id)
	 * @param {object} config - DC configuration
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
	 * @param {(st.net.DataChannel|string)} dc - could be DC.id or DC object
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
	 * 
	 * @param {st.net.DataChannel} dch - Data channel object
	 */
	_mapDCcontrolEvents(dch) {
		
		let nnetm = this;
		
		// Map event ChannelInitialized
		dch.eventEmitter.on(dch.CONSTANTS.Events.ChannelInitialized, function(data) {
			nnetm._event_ChannelInitialized(data, dch, nnetm);
		});
		
		// Map event ChannelStarted
		dch.eventEmitter.on(dch.CONSTANTS.Events.ChannelStarted, function(data) {
			nnetm._event_ChannelStarted(data, dch, nnetm);
		});
		
		// Map event ChannelStopped
		dch.eventEmitter.on(dch.CONSTANTS.Events.ChannelStopped, function(data) {
			nnetm._event_ChannelStopped(data, dch, nnetm);
		});
		
		// Map event ChannelClosed
		dch.eventEmitter.on(dch.CONSTANTS.Events.ChannelClosed, function(data) {
			nnetm._event_ChannelClosed(data, dch, nnetm);
		});
	}
	
	
	/**
	 * UnMap control events for DC
	 * 
	 * @param {st.net.DataChannel} dch - Data channel object
	 */
	_unMapDCcontrolEvents(dch) {
		
		let nnetm = this;
		
		dch.eventEmitter.removeAllListeners(dch.CONSTANTS.Events.ChannelInitialized);
		dch.eventEmitter.removeAllListeners(dch.CONSTANTS.Events.ChannelStarted);
		dch.eventEmitter.removeAllListeners(dch.CONSTANTS.Events.ChannelStopped);
		dch.eventEmitter.removeAllListeners(dch.CONSTANTS.Events.ChannelClosed);

		
	}
	
	
	/**
	 * Set data channel options
	 * 
	 * @param {st.net.DataChannel} dch - Data channel object
	 * @param {object} options - Options object
	 * @param {number} [options.loopTime] - Looptime 
	 * @param {string} [options.netLocation] - Net location 
	 * @param {number} [options.socketPort] - Socket port 
	 * 
	 */
	setDCOptions(dch, options) {
		
		let nnetm = this;
		
		if (dch.state !== dch.CONSTANTS.States.DCstate_Config) {
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
	 * 
	 * @param {object} data - Event data 
	 * @param {st.net.DataChannel} dch - Data Channel object
	 * @param {st.net.services.NodeNetManager} nnetm - Node Net manager object
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
	
	
	/**
	 * Event ChannelStarted
	 * 
	 * @param {object} data - Event data 
	 * @param {st.net.DataChannel} dch - Data Channel object
	 * @param {st.net.services.NodeNetManager} nnetm - Node Net manager object
	 */
	_event_ChannelStarted(data, dch, nnetm) {
		
		if (nnetm === undefined) {
			nnetm = this;
		}
		
		// Emit event ChannelInitialized
		nnetm.eventEmitter.emit(nnetm.CONSTANTS.Events.ChannelStarted, 
			{
				"channelID": dch.config.id,
				"dataChannel": dch
			});
		
	}
	
	
	/**
	 * Event ChannelStopped
	 * 
	 * @param {object} data - Event data 
	 * @param {st.net.DataChannel} dch - Data Channel object
	 * @param {st.net.services.NodeNetManager} nnetm - Node Net manager object
	 */
	_event_ChannelStopped(data, dch, nnetm) {
		
		if (nnetm === undefined) {
			nnetm = this;
		}
		
		// Emit event ChannelInitialized
		nnetm.eventEmitter.emit(nnetm.CONSTANTS.Events.ChannelStopped, 
			{
				"channelID": dch.config.id,
				"dataChannel": dch
			});
		
	}
	
	
	/**
	 * Event ChannelClosed
	 * 
	 * @param {object} data - Event data 
	 * @param {st.net.DataChannel} dch - Data Channel object
	 * @param {st.net.services.NodeNetManager} nnetm - Node Net manager object
	 */
	_event_ChannelClosed(data, dch, nnetm) {
		
		if (nnetm === undefined) {
			nnetm = this;
		}
		
		// Emit event ChannelClosed
		nnetm.eventEmitter.emit(nnetm.CONSTANTS.Events.ChannelClosed, 
			{
				"channelID": dch.config.id,
				"dataChannel": dch
			});
		
	}
}

module.exports = NodeNetManager;

