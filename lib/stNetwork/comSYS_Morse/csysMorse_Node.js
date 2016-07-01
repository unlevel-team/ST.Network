"use strict";

/**
 * 
 * COMSystem library
 * for role Server
 * 
 * Provides communications system to ST network
 * 
 * 
 * 
 * v. Morse
 */


/**
 * import DataMessage
 * @ignore
 */
let DataMessage = require('../DataChannel.js').DataMessage;


/**
 * import TBind_Morse
 * @ignore
 */
let TBind_Morse = require('./COMsys_Morse.js').TBind_Morse;

/**
 * import COMSystem_Morse
 * @ignore
 */
let COMSystem_Morse = require('./COMsys_Morse.js').COMSystem_Morse;


/**
 * import COMSys_Morse_Srv_Node
 * @ignore
 */
let COMSys_Morse_Srv_Node = require('./csysMorse_NodeServices.js').COMSys_Morse_Srv_Node;



/**
 * ThingBind for role Node
 * 
 * @class
 * @implements TBind_Morse
 * 
 */
class TBind_Morse_Node extends TBind_Morse {
	
	/**
	 * @constructs TBind_Morse_Node
	 * 
	 * @param {string} type - Type of bind
	 * @param {object} source - Source
	 * @param {object} target - Target
	 * @param {object} options - Options object
	 * 
	 */
	constructor(type, source, target, options) {
		super(type, source, target, options);
	}
	
	
	/**
	 * Bind DC to Sensor
	 */
	_init_DCtoSensor() {
		
		let tbind = this;
		
		let dc = tbind.target;
		let sensor = tbind.source;
		
		if (tbind.options === undefined || 
				tbind.options.bindID === undefined) {
			throw "This bind requires an ID.";
		}
		
		
		tbind.bindID = tbind.CONSTANTS.Config.BindType_DCtoSensor + tbind.options.bindID;	// Set bind ID
		
		// Define bind function
		tbind._bindFunction = function(data) {
			
			if (tbind.state !== tbind.CONSTANTS.States.State_Working) {
				return;
			}
			
			if (tbind.options.bindFunction) {
				tbind.options.bindFunction(data);
			}
			
			let msg = new DataMessage(data);
			msg.typeExtra = tbind.CONSTANTS.Config.Version;
			msg._Morse = {
				"bindID": tbind.bindID
			};
			
			dc.sendMessage(msg);
		};
		
		
		// Map event SensorData
		sensor.eventEmitter.on(sensor.CONSTANTS.Events.SensorData, tbind._bindFunction );
		
		tbind.state = tbind.CONSTANTS.States.State_Ready;
	}
	
	
	/**
	 * Bind DC to Actuator
	 */
	_init_DCtoActuator() {
		
		let tbind = this;
		let dc = tbind.source;
		let actuator = tbind.target;
		
		if (tbind.options === undefined || 
				tbind.options.bindID === undefined) {
			throw "This bind requires an ID.";
		}
		
		if (tbind.options.comSYS === undefined) {
			throw "This bind requires a comSYS.";
		}
		
		
		let comSYS = tbind.options.comSYS;
		
		tbind.bindID = tbind.CONSTANTS.Config.BindType_DCtoActuator + tbind.options.bindID;	// Set bind ID
		
		
		// Define bind function
		tbind._bindFunction = function(data) {
			
			if (tbind.state !== tbind.CONSTANTS.States.State_Working) {
				return;
			}
			
			if (tbind.options.bindFunction) {
				tbind.options.bindFunction(data);
			}
			
			actuator.emit(actuator.CONSTANTS.Events.ActuatorData, data);	// Emit event ActuatorData
			
		};
		
		
		comSYS.bindDC(dc);	// Bind Communications system to DC
		
		// Map event `bindID`
		comSYS.eventEmitter.on(tbind.bindID, tbind._bindFunction);
		
	}
	
	
	/**
	 * Unbind
	 */
	unbind() {
		
		let tbind = this;
		
		switch (tbind.type) {
		
			case tbind.CONSTANTS.Config.BindType_DCtoSensor:
				
				let sensor = tbind.target;
				
				// UnMap event SensorData
				sensor.eventEmitter.removeListener(sensor.CONSTANTS.Events.SensorData, tbind._bindFunction);
				break;
				
			case tbind.CONSTANTS.Config.BindType_DCtoActuator:
				
				let comSYS = tbind.options.comSYS;
				
				// UnMap event `bindID`
				comSYS.eventEmitter.removeListener(tbind.bindID, tbind._bindFunction);
				break;
	
			default:
				break;
			
			}

		super.unbind();
	}
}


/**
 * Communications System for Node role
 * 
 * @class
 * @implements COMSystem_Morse
 *  
 */
class CSYS_Morse_Node extends COMSystem_Morse {
	
	/**
	 * 
	 * @constructs CSYS_Morse_Node
	 * 
	 * @param {object} config - Configuration object
	 * 
	 */
	constructor(config) {
		
		super(config);

		
		
	}
	
	
	/**
	 * Initialize
	 */
	initialize() {
		
		super.initialize();
		
		let comSYS = this;
		let _config = comSYS.config;
		
		comSYS._service = new COMSys_Morse_Srv_Node(comSYS);
	}
	
	
}


let cysMorse_roleNode_Lib = {
		"TBind_Morse_Node" : TBind_Morse_Node,
		"CSYS_Morse_Node" : CSYS_Morse_Node
};


module.exports = cysMorse_roleNode_Lib;

