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
 * 
 * @requires TBind_Morse
 * @requires COMSystem_Morse
 * 
 * @ignore
 */


/**
 * Import TBind_Morse
 * @ignore
 */
let TBind_Morse = require('./COMsys_Morse.js').TBind_Morse;

/**
 * Import COMSystem_Morse
 * @ignore
 */
let COMSystem_Morse = require('./COMsys_Morse.js').COMSystem_Morse;

/**
 * Import COMSys_Morse_Srv_Server
 * @ignore
 */
let COMSys_Morse_Srv_Server = require('./csysMorse_ServerServices.js').COMSys_Morse_Srv_Server;



/**
 * ThingBind for role Server
 * 
 * @class
 * @implements TBind_Morse
 */
class TBind_Morse_Server extends TBind_Morse {
	
	/**
	 * @constructs TBind_Morse_Server
	 */
	constructor(type, source, target, options) {
		super(type, source, target, options);
		
		this._bindFunction = null;
	}
	
	
}


/**
 * Communications System for Server role
 *  
 */
class CSYS_Morse_Server extends COMSystem_Morse {
	
	constructor(config) {
		
		super(config);
		
	}
	
	
	initialize() {
		
		super.initialize();
		
		let comSYS = this;
//		let config = comSYS.config;
		
		comSYS._service = new COMSys_Morse_Srv_Server(comSYS);
	}
	
	
}



let cysMorse_roleServer_Lib = {
		"TBind_Morse_Server" : TBind_Morse_Server,
		"CSYS_Morse_Server" : CSYS_Morse_Server
};


module.exports = cysMorse_roleServer_Lib;