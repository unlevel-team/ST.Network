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
 * @memberof st.net.comsys_morse
 * @implements st.net.comsys_morse.TBind_Morse
 * 
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
 * @class
 * @memberof st.net.comsys_morse
 * @implements st.net.comsys_morse.COMSystem_Morse
 */
class CSYS_Morse_Server extends COMSystem_Morse {
	
	/**
	 * 
	 * @constructs CSYS_Morse_Server
	 */
	constructor(config) {
		
		super(config);
		
		let _comSYS = this;
		
		_comSYS._scs_RouteNet = null;
		
	}
	
	
	/**
	 * Initialize
	 */
	initialize() {
		
		super.initialize();
		
		let comSYS = this;
//		let config = comSYS.config;
		
		comSYS._service = new COMSys_Morse_Srv_Server(comSYS);
	}
	
	
	/**
	 * Get Server Control Services routes
	 * for network
	 * 
	 * @param {object} options - Options object
	 * @param {st.net.COMSystem} [options.comSYS] - COM System object
	 * @param {object} options.nodesManager - Nodes manager
	 * @param {st.net.services.NodesNetManager} options.nodesNetManager - Nodes Net manager
	 * @param {st.net.services.ServerNetManager} options.serverNetManager - Server Net manager
	 * 
	 * @throws Exception
	 * 
	 * @returns {st.net.comsys_morse.scs_routes.SCS_RouteNet}
	 * 
	 */
	getSCSRoutes(options) {
		
		let _comSYS = this;
		
		if (options === undefined || 
				options === null) {
			options = {};
		}
		
		if (options.comSYS !== undefined) {
			_comSYS = options.comSYS;
		}
		
		if (options.nodesManager === undefined) {
			throw "nodesManager is required.";			
		}
		let _nodesManager = options.nodesManager;

		if (options.nodesNetManager === undefined) {
			throw "nodesNetManager is required.";			
		}
		let _nodesNetManager = options.nodesNetManager;

		if (options.serverNetManager === undefined) {
			throw "serverNetManager is required.";			
		}
		let _serverNetManager = options.serverNetManager;

		
		if (_comSYS._scs_RouteNet === null) {
			
			let SCS_RouteNet = require('./scs_Routes/SCS_RouteNet.js');
		
			try {
				_comSYS._scs_RouteNet = new SCS_RouteNet(_nodesManager, _nodesNetManager, _serverNetManager);
			} catch (e) {
				// TODO: handle exception
				throw "Error in route Net." + e;
			}
			
			
		}
		
		return _comSYS._scs_RouteNet;
	
	}
	
	
	
}



let cysMorse_roleServer_Lib = {
		"TBind_Morse_Server" : TBind_Morse_Server,
		"CSYS_Morse_Server" : CSYS_Morse_Server
};


module.exports = cysMorse_roleServer_Lib;