"use strict";

/*
 Server Net manager
 
 - Provides net management for server.
 - Add data channel to server
 - Remove data channel from server
 - Get data channels of server
 
 
 */


/**
 * import DataChannelsManager
 * @ignore
 */
let DataChannelsManager = require('../DataChannel.js').DataChannelsManager;



/**
 * Server net manager
 * 
 * @class
 * @implements DataChannelsManager
 * 
 * @property {object} config - Configuration object
 * 
 */
class ServerNetManager extends DataChannelsManager {
	
	/**
	 * @constructs ServerNetManager
	 * 
	 * @param {object} config - Configuration object
	 */
	constructor(config) {
		
		super();
		this.config = config;

	}
	
	
	/**
	 * Add data channel to server
	 * 
	 * @param {string} dchID - Data channel ID
	 * @param {object} config - Configuration object for DC
	 */
	addDataChannelToServer(dchID, config) {
		
		let snetm = this;
		let server = snetm.config._server;
		
		var dch_Config = {
			id: dchID,
			type: snetm.CONSTANTS.Config.DCtype_socketio,
			_netState: snetm.CONSTANTS.Config.DCstate_Config
		};
		
		
		// ~ ~ ~ ^^^ ~ ~ ~  ^^^ ~ ~ ~  ^^^ ~ ~ ~ ^^^ ~ ~ ~  ^^^ ~ |\/|~~~ 
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
		// ~ ~ ~ ^^^ ~ ~ ~  ^^^ ~ ~ ~  ^^^ ~ ~ ~ ^^^ ~ ~ ~  ^^^ ~ |/\|~~~ 

		
		var dch = this.get_DataChannel(dch_Config);
		
		this.addDataChannel(dch);
	}
	
}


module.exports = ServerNetManager;
