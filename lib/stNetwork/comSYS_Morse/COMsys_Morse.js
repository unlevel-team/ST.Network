"use strict";

/**
 * COMSystem library
 * 
 * Provides communications system to ST network
 * 
 * 
 * v. Morse
 * @ignore
 */


/**
 * Import DataMessage
 * @ignore
 */
let DataMessage = require('../DataChannel.js').DataMessage;

/**
 * Import ThingBind
 * @ignore
 */
let ThingBind = require('../COMSystem.js').ThingBind;

/**
 * Import COMSystem
 * @ignore
 */
let COMSystem = require('../COMSystem.js').COMSystem;

let COMSystem_CONSTANTS = require('../COMSystem.js').COMSystem_CONSTANTS;


const COMSystem_Morse_CONSTANTS = {
	"Config" : {
		"Version" : "Morse"
	}
};


/**
 * TBind_Morse
 * 
 * @class
 * @interface
 */
class TBind_Morse extends ThingBind {
	
	constructor(type, source, target, options) {
		super(type, source, target, options);
		
		this._bindFunction = null;
	}
	
	
	/**
	 * Start Bind
	 */
	start() {
		
		let tbind = this;
		
		if (tbind.state !== tbind.CONSTANTS.States.State_Ready) {
			throw "Bad Bind state";
		}
		
		super.start();
	
	}
	

	/**
	 * Stop Bind
	 */
	stop() {
		
		let tbind = this;
		
		if (tbind.state !== tbind.CONSTANTS.States.State_Working) {
			throw "Bad Bind state";
		}
		
		super.stop();
	}
	
}


/**
 * Communications System
 * 
 * Requires role configuration. (Server | Node)
 * 
 * @class
 * @implements COMSystem
 * 
 */
class COMSystem_Morse extends COMSystem {
	
	/**
	 * 
	 * @constructs COMSystem_Morse
	 * 
	 * @param {object} config - Configuration object
	 */
	constructor(config) {
		
		super(config);
		
		this.MorseCONSTANTS = COMSystem_Morse_CONSTANTS;
		
		this._service = null;
		
		
		this.CONSTANTS.Config.Version = COMSystem_Morse_CONSTANTS.Config.Version;
		
	}
	
	
	/**
	 * Initialize
	 */
	initialize() {
		
		super.initialize();
		
		let comSYS = this;
		let _config = comSYS.config;
		
		if (_config.role === undefined) {
			throw "role is required.";
		}
		
		if (_config.sensorManager === undefined) {
			throw "sensorManager is required.";
		}
		
		if (_config.actuatorsManager === undefined) {
			throw "actuatorsManager is required.";
		}
		
//		comSYS.role = _config.role;
//		
//		switch (comSYS.role) {
//		
//			case comSYS.CONSTANTS.Config.Role_Node:
//				comSYS._init_RoleNode();
//				break;
//				
//				
//			case comSYS.CONSTANTS.Config.Role_Server:
//				comSYS._init_RoleServer();
//				break;
//	
//			default:
//				throw "Bad Role.";
////				break;
//		}
		
		
	}
	
	
	/**
	 * Initialize Node role
	 */
	_init_RoleNode() {
		
		let comSYS = this;
		let _config = comSYS.config;
		
		if (_config.controlChannel === undefined) {
			throw "controlChannel is required.";
		}
		
//		comSYS._service = new COMSys_Morse_Srv_Node(comSYS);
	}
	
	
	/**
	 * Initialize Server role
	 */
	_init_RoleServer() {
		
		let comSYS = this;
		let _config = comSYS.config;
		
//		comSYS._service = new COMSys_Morse_Srv_Server(comSYS);
	}
	
	
	/**
	 * Bind data channel
	 * 
	 * @param {DataChannel} dc - Data channel
	 * 
	 */
	bindDC(dc) {
		
		let comSYS = this;
		
		if (dc.config._comSYS_Morse !== undefined && 
				dc.config._comSYS_Morse !== null) {
			return;
		}
		
		dc.config._comSYS_Morse = true;
		
		// Map event MessageReceived
		dc.eventEmitter.on(dc.CONSTANTS.Events.MessageReceived, comSYS._DC_Message);
		
	}
	
	
	/**
	 * Unbind data channel
	 * 
	 * @param {DataChannel} dc - Data channel
	 */
	unbindDC(dc) {
		
		let comSYS = this;
		
		if (dc.config._comSYS_Morse === undefined ||
				dc.config._comSYS_Morse === null) {
			return;
		}
		
		// UnMap event MessageReceived
		dc.eventEmitter.removeListener(dc.CONSTANTS.Events.MessageReceived, comSYS._DC_Message);
		
		dc.config._comSYS_Morse = null;
		
	}
	
	
	/**
	 * Data channel message
	 */
	_DC_Message(msg) {
		
		let comSYS = this;
		
		
		let messages = msg.filter(function(_msg, _i) {
			if (_msg.typeExtra !== undefined && 
					_msg.typeExtra === comSYS.CONSTANTS.Config.Version) {
				return true;
			}
		});
		
		
		messages.forEach(function(_msg, _i) {
			comSYS.eventEmitter.emit(_msg._Morse.bindID, _msg);	// Emit event {bindID}
		});
		
	}
	
}


/**
 * Get COMSystem
 * 
 * @returns {(CSYS_Morse_Node|CSYS_Morse_Server)} - Depends on 'config.role'
 */
const getCOMSystem = function(config) {
	
	if (config.role === undefined) {
		throw "role is required.";
	}
	
	let comSystem = null;
	
	switch (config.role) {
	
		case COMSystem_CONSTANTS.Config.Role_Node:
			
			let CSYS_Morse_Node = require('./csysMorse_Node.js').CSYS_Morse_Node;
			comSystem = new CSYS_Morse_Node(config);
			break;
			
			
		case COMSystem_CONSTANTS.Config.Role_Server:
			
			let CSYS_Morse_Server = require('./csysMorse_Server.js').CSYS_Morse_Server;
			comSystem = new CSYS_Morse_Server(config);
			break;

		default:
			throw "Bad Role.";
//			break;
	}
	
	return comSystem;
	
};


let cysMorse_Lib = {
		"TBind_Morse" : TBind_Morse,
		"COMSystem_Morse" : COMSystem_Morse,
		
		"getCOMSystem": getCOMSystem
};


module.exports = cysMorse_Lib;
