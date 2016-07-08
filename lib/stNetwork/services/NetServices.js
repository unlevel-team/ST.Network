"use strict";

/*
 SomeThings Network services library

*/





/**
 * Network service constants
 * 
 * @memberof st.net.services
 */
const NETservices_CONSTANTS = {
		
	"Messages" : {
		"getNetInfo" : "Get Net Info",
		"NetInfo" : "Net Info",
		
		
		"createDataChannel" : "Create DC",
		"DataChannelCreated" : "DC Created",
		
		"deleteDataChannel" : "Delete DC",
		"DataChannelDeleted" : "DC Deleted",
		
		
		"getDataChannelOptions" : "get DC Options",
		"DataChannelOptions" : "DC Options",
		
		"SetDCOptions" : "Set DC Options",
		"DCOptionsUpdated" : "DC Options Updated",
		
		"initDC" : "Init DC",
		"DCInitialized" : "DC Initialized",

		"closeDC" : "Close DC",
		"DCClosed" : "DC Closed",
		
		"startDataChannel" : "Start DC",
		"DataChannelStarted" : "DC started",
		
		"stopDataChannel" : "Stop DC",
		"DataChannelStopped" : "DC Stopped"

	},
	
	
	
	"Events" : {
		"DataChannelCreated" : "DC Created"

	}
	
};



/**
 * The stURI_DATA_Param object.
 * 
 * @typedef {Object} stURI_DATA_Param
 * @memberof st.net.services
 * @type Object
 * 
 * @property {string} name - Name
 * @property {string} value - Value
 * 
 */


/**
 * The stURI_DATA object.
 * 
 * @typedef {Object} stURI_DATA
 * @memberof st.net.services
 * @type Object
 * 
 * @property {string} stURI - The ST URI parsed
 * @property {string} schema - URI schema
 * @property {string} context - URI context
 * @property {string} action - URI action
 * @property {st.net.services.stURI_DATA_Param[]} params - URI parameters objects
 * 
 */


/**
 * 
 * 
 * @class
 * 
 * @memberof st.net.services
 * 
 * @property {string} stURI - The ST URI parsed
 * @property {string} schema - URI schema
 * @property {string} context - URI context
 * @property {string} action - URI action
 * @property {st.net.services.stURI_DATA_Param[]} params - URI parameters objects
 * 
 */
class ST_URI {
	
	/**
	 * 
	 * @constructs ST_URI
	 * 
	 * @param {object} [options] - Options object
	 * @param {st.net.services.stURI_DATA} [options.stURI_DATA] - ST URI DATA object
	 * 
	 */
	constructor(options) {
		
		if (options === undefined ||
				options === null) {
			options = {};
		}
		
		let stURI = this;
		stURI.stURI = null;
		stURI.schema = null;
		stURI.context = null;
		stURI.action = null;
		stURI.params = [];
		
		
		if (options.stURI_DATA !== undefined) {
			
			let uriDATA = options.stURI_DATA;
			
			stURI.stURI = uriDATA.stURI;
			stURI.schema = uriDATA.schema;
			stURI.context = uriDATA.context;
			stURI.action = uriDATA.action;
			stURI.params = uriDATA.params;
			
		}
		
	}
	
	
	/**
	 * Get parameter by name
	 * 
	 * @param {string} name -  Name of parameter
	 * @param {object} [options] -  Options object
	 * @param {st.net.services.ST_URI} [options.stURI] - ST_URI object
	 * 
	 * @return {object} result - Result
	 * @property {st.net.services.stURI_DATA_Param|null} result.param - The parameter
	 * @property {number} result.position - Position of the result
	 * 
	 */
	getParameterByName(name, options) {
		
		let stURI = this;
		
		if (options === undefined ||
				options === null) {
			options = {};
		}
		
		
		if (options.stURI !== undefined) {
			stURI = options.stURI;
		}
		
		let param = null;
		let _i = -1;
		
		_i = stURI.params.map(function(x) {return x.name; }).indexOf(name);

		if (_i !== -1) {
			param = stURI.params[_i];
		}

		return {
			"param": param,
			"position": _i
		};
		
	}
	
}


/**
 * NET services library
 * 
 * @namespace NETservices_Lib
 * @memberof st.net.services
 * 
 */
let NETservices_Lib = {
		
		
	/**
	 * Parses ST URI
	 * 
	 * <pre>
	 * 
	 * -- scheme:context:body
	 * 
	 * st:engines:config/[type=file][path=./stSensors/stSensor_Keyboard.js]
	 * st:engines:config/[type=module][moduleName=st.engines][method=sensors.getSensor_Dummy01]
	 * st:engines:config/[type=module][moduleName=my.module][method=getMySensor]
	 * 
	 * -- regex filter for body params ^\[(\s+\S+)*\]$
	 * -- (^\[(\s+\S+)*\]$)*
	 * -- (?:\[.+\])
	 * 
	 * 
	 * </pre>
	 * 
	 * @memberof st.net.services.NETservices_Lib
	 * 
	 * @param {string} stURI - The ST URI string
	 * @param {object} options - Options object.
	 * 
	 * @returns {st.net.services.stURI_DATA}
	 * @throws Exceptions
	 * 
	 */
	"parse_stURI": function (stURI, options) {
		
		if (options === undefined ||
				options === null) {
			options = {};
		}
		
		
		let _URIpieces = stURI.split(':');
		let _URIschema = _URIpieces[0];
		
		if (_URIschema !== 'st') {
			throw "Bad URI";
		}
		
		console.log('<~i~> NETservices_Lib.parse_stURI');	// TODO REMOVE DEBUG LOG
		console.log(' <~> _URIpieces');	// TODO REMOVE DEBUG LOG
		console.log(_URIpieces);	// TODO REMOVE DEBUG LOG
		console.log(' <~> _URIschemma');	// TODO REMOVE DEBUG LOG
		console.log(_URIschema);	// TODO REMOVE DEBUG LOG
		
		
		let _URIcontext = _URIpieces[1];
		let _URIbody = stURI.substr(_URIschema.length + _URIcontext.length + 1);
		
		let _BODYaction = _URIbody.substring(
				1, 
				_URIbody.indexOf('/') );
		
		let _BODYparams = _URIbody.substring( _URIbody.indexOf('/') + 1 );
		
		
		let _params = _BODYparams.split(']');	// Split for parameters
		let _paramsFiltered = [];
		
		_paramsFiltered = _params.filter(function(_param, _i) {		// Filter parameters 
			
			if (_param[0] === '[') {
				return true;
			}
			
		});
		
		let params = [];
		_paramsFiltered.forEach(function(_param, _i) {		// Add parameters
			
			let param = {};
			param.name = _param.substring( 1, _param.indexOf('=') );
			param.value = _param.substring( _param.indexOf('=') + 1 );
			params.push(param);
		});
		
		
		
		let stURI_DATA = {
				
			"stURI": stURI,
			"schema": _URIschema,
			"context": _URIcontext,
			"action": _BODYaction,
			"params": params
		};
		
		return stURI_DATA;
		
		
	}
	
		
};







let _lib = {
		
	"NETservices_CONSTANTS": NETservices_CONSTANTS,
	"NETservices_Lib": NETservices_Lib
		
};



module.exports = _lib;