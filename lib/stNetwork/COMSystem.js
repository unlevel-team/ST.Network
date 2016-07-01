"use strict";

/**
 * COMSystem library
 * 
 * Provides communications system to ST network
 * 
 */


/**
 * Import EventEmitter
 * @ignore
 */
let EventEmitter = require('events').EventEmitter;

/**
 * Import DataMessage
 * @ignore
 */
let DataMessage = require('./DataChannel.js').DataMessage;


/**
 * COMSystem constants
 * 
 * @static
 */
const COMSystem_CONSTANTS = {
	
	"Config" : {
		
		"Role_Server" : "Server",
		"Role_Node" : "Node",
		
		"BindType_DCtoSensor" : "DCtoSensor",
		"BindType_DCtoActuator" : "DCtoActuator"
	},
	
	
	"States" : {
		"State_Config" : "config",
		"State_ConfigNet" : "configNet",
		"State_Ready" : "ready",
		"State_Working" : "working",
		"State_Stop" : "stop"
	},
	
	
	"Events" : {
		"Bind_Started": "BindStarted",
		"Bind_Stopped": "BindStopped",
		"Unbind": "Unbind",
		
		"Bind_Added": "BindAdded",
		"Bind_Removed": "BindRemoved"
		
	},
	
	
	"Messages" : {
		"getBindList" : "Get BindList",
		"BindList" : "BindList",

		
		"createBind" : "Create Bind",
		"Bind_Created": "BindCreated",
		"getBindOptions" : "Get BindOptions",
		"setBindOptions" : "Set BindOptions",
		"BindOptionsUpdated" : "BindOptionsUpdated",
		"startBind": "Start Bind",
		
		"BindStarted": "Bind Started",
		"UnBind": "UnBind",
		"BindFree": "BindFree",

		"ErrorInfo": "ErrorInfo"
	}
		
};


/**
 * ThingBind
 * 
 * @class
 * 
 * @property {string} version - Version
 * @property {string} bindID - Bind ID
 * @property {string} type - Bind type
 * @property {string} role - Bind role
 * @property {string} state - Bind state
 * @property {object} source - Bind source
 * @property {object} target - Bind target
 * @property {object} options - Options
 * @property {object} eventEmitter - Object for emit events.
 * 
 */
class ThingBind {
	
	/**
	 * @constructs ThingBind
	 */
	constructor(type, source, target, options) {
		
		this.CONSTANTS = COMSystem_CONSTANTS;
		
		this.version = null;
		
		this.bindID = null;
		this.type = type;
		this.role = null;
		this.state = this.CONSTANTS.States.State_Config;
		
		this.source = source;
		this.target = target;
		this.options = options;
		
		this.eventEmitter = new EventEmitter();

		
	}
	
	/**
	 * Initialize Bind
	 */
	initialize() {
		
		let tbind = this;
		
		switch (tbind.type) {
			case tbind.CONSTANTS.Config.BindType_DCtoSensor:
				tbind._init_DCtoSensor();
				break;
	
			case tbind.CONSTANTS.Config.BindType_DCtoActuator:
				tbind._init_DCtoActuator();
				break;
			default:
				throw "Bad type.";
//				break;
		}
		
	}
	
	
	/**
	 * Bind DC to Sensor
	 */
	_init_DCtoSensor() {
		
	}
	
	
	/**
	 * Bind DC to Actuator
	 */
	_init_DCtoActuator() {
		
	}
	
	
	/**
	 * Start Bind
	 * 
	 * @param {boolean} synchro - Synchronization (true or false)
	 * @param {object} options - Options object
	 */
	start(synchro, options) {
		
		let tbind = this;
		
		if (synchro === undefined) {
			synchro = true;
		}
		
		if (options === undefined) {
			options = [];
		}
		
		tbind.state = tbind.CONSTANTS.States.State_Working;
		
		tbind.eventEmitter.emit(tbind.CONSTANTS.Events.Bind_Started,
			{
				"synchro" : synchro,
				"options" : options
			}			
		);	// Emit event Bind_Started
	}
	
	
	/**
	 * Stop Bind
	 * 
	 * @param {boolean} synchro - Synchronization (true or false)
	 * @param {object} options - Options object
	 */
	stop(synchro, options) {
		
		let tbind = this;
		
		if (synchro === undefined) {
			synchro = true;
		}
		
		if (options === undefined) {
			options = [];
		}
		
		tbind.state = tbind.CONSTANTS.States.State_Stop;
		
		tbind.eventEmitter.emit(tbind.CONSTANTS.Events.Bind_Stopped,
			{
				"synchro" : synchro,
				"options" : options
			}
		);	// Emit event Bind_Stopped
		
		
	}
	
	
	/**
	 * Unbind
	 * 
	 * @param {boolean} synchro - Synchronization (true or false)
	 * @param {object} options - Options object
	 */
	unbind(synchro, options) {
		
		let tbind = this;
		
		if (synchro === undefined) {
			synchro = true;
		}
		
		if (options === undefined) {
			options = [];
		}
		
		
		tbind.state = tbind.CONSTANTS.States.State_Config;
		
		// Emit event Unbind
		tbind.eventEmitter.emit(tbind.CONSTANTS.Events.Unbind, 
			{
				"synchro" : synchro,
				"options" : options
			}
		);
		
	}
	
}


/**
 * COMSystem
 * 
 * @class
 * @property {string} version - Version
 * @property {object} config - Configuration object
 * @property {object} controlChannel - Control channel object
 * @property {ThingBind[]} thingsBindings - ThingBinds list
 * 
 */
class COMSystem {
	
	/**
	 * @constructs COMSystem
	 */
	constructor(config) {
		
		this.CONSTANTS = COMSystem_CONSTANTS;
		this.version = this.CONSTANTS.Config.Version;
		this.config = config;
		
		
		this.controlChannel = null;
		this.thingsBindings = [];
		
	}
	
	
	/**
	 * Initialize COMSystem
	 */
	initialize() {
		
		let comSYS = this;
		
		if (comSYS.config === undefined) {
			throw "Configuration is required.";
		}
		
		let _config = comSYS.config;
		
//		if (_config.controlChannel == undefined) {
//			throw "controlChannel is required.";
//		}
		
	}
	
	
	/**
	 * Add bind
	 * 
	 * @param tbind The ThingBind object
	 * @param synchro Synchronization (true or false)
	 * @param options Options
	 */
	addBind(tbind, synchro, options) {
		
		let comSYS = this;
		
		let tbSearch = comSYS.getBindByID(tbind.bindID);
		
		if (synchro === undefined) {
			synchro = true;
		}
		
		if (options === undefined) {
			options = [];
		}
		
		if (tbSearch.tbind !== null) {
			throw "Bind ID already exists.";
		}
		
		comSYS.thingsBindings.push(tbind);
		
		// Emit event Bind_Added
		comSYS.eventEmitter.emit( comSYS.CONSTANTS.Events.Bind_Added, 
			{
				"synchro": synchro, 
				"options": options,
				"bind": tbind
			}
		);	
		
	}
	
	
	/**
	 * Get Bind searched by ID
	 */
	getBindByID(bindID){
		
		let comSYS = this;
		
		let _i = 0;
		let tbind = null;
		
		
		_i = comSYS.thingsBindings.map(function(x) {return x.bindID; }).indexOf(bindID);
		if (_i !== -1) {
			tbind = comSYS.thingsBindings[_i];
		}
		
		
		return {
			"tbind" : tbind,
			"position": _i
		};
		
	}
	
	
	/**
	 * Remove Bind
	 * 
	 * @param tbind The ThingBind object
	 * @param synchro Synchronization (true or false)
	 * @param options Options
	 */
	removeBind(bindID, synchro, options) {
		
		let comSYS = this;
		
		if (synchro === undefined) {
			synchro = true;
		}
		
		if (options === undefined) {
			options = [];
		}
		
		let bindSearch = comSYS.getBindByID(bindID);
		if (bindSearch.tbind === null){
			throw "Bind not found.";
		}
		
		let tbind = bindSearch.tbind;
		
		if (tbind.state !== comSYS.CONSTANTS.States.State_Config) {
			throw "Bad Bind state.";
		}
		
		comSYS.thingsBindings.splice(bindSearch.position, 1);
		
		// Emit event Bind_Removed
		comSYS.eventEmitter.emit( comSYS.CONSTANTS.Events.Bind_Removed, 
			{
				"synchro": synchro, 
				"options": options,
				"bindID": bindID
			}
		);	
		
	}
	
}



/**
 * Get COMSystem
 * 
 * @param {object} config - Configuration object
 * @returns {COMSystem}
 */
function getCOMSystem(config) {
	
	let _getCOMSystem = require('./comSYS_Morse/COMsys_Morse.js').getCOMSystem;
	let comSYS = _getCOMSystem(config);

	return comSYS;
}



let comsystem_Lib = {
		"COMSystem_CONSTANTS" : COMSystem_CONSTANTS,
		"ThingBind" : ThingBind,
		"COMSystem" : COMSystem,
		
		"getCOMSystem": getCOMSystem
};


module.exports = comsystem_Lib;