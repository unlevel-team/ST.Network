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
 * The stURI_DATA object.
 * 
 * @typedef {Object} stURI_DATA
 * @memberof st.net.services
 * @type Object
 * 
 * @property {string} stIRI - The ST URI parsed
 * @property {string} schema - URI schema
 * @property {string} context - URI context
 * @property {string} action - URI action
 * @property {st.net.services.stIRI_Param[]} params - URI parameters objects
 * 
 */


/**
 * The stURI_DATA_Param object.
 * 
 * @typedef {Object} stIRI_Param
 * @memberof st.net.services
 * @type Object
 * 
 * @property {string} name - Name
 * @property {string} value - Value
 * 
 */



/**
 * The response of check ST_URI.
 * 
 * @typedef {Object} Response_chkST_URI
 * @memberof st.net.services.NETservices_Lib
 * @type Object
 * 
 * @property {boolean} checkOK - Check result
 * @property {string} errorMSG - Error message
 * 
 */




/**
 * ST_URI
 * <pre>
 * Represents the information related to the data of a stIRI
 * </pre>
 * 
 * @class
 * 
 * @memberof st.net.services
 * 
 * @property {string} stIRI - The ST URI parsed
 * @property {string} schema - URI schema
 * @property {string} context - URI context
 * @property {string} action - URI action
 * @property {st.net.services.stIRI_Param[]} params - URI parameters objects
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
	 * @param {object} options -  Options object
	 * @param {string} options.name -  name to match
	 * @param {st.net.services.ST_URI} [options.stIRI] - ST_URI object
	 * 
	 * @return {object} result - Result
	 * @property {st.net.services.stIRI_Param|null} result.param - The parameter
	 * @property {number} result.position - Position of the result
	 * 
	 */
	getParameterByName(options) {
		
		if (options === undefined ||
				options === null) {
			options = {};
		}
		
		let _stURI = this;
		if (options.sUIRI !== undefined) {
			_stURI = options.stURI;
		}
		
		if (options.name === undefined) {
			throw 'name is required.';
		}
		let _name = options.name;

		
		return NETservices_Lib.getParamByName({
			'params': _stURI.params,
			'name': _name
		});
		
	}
	
	
	/**
	 * Check ST IRI
	 * 
	 * @param {object} options - Options object.
	 * @param {object} [options.stIRI] - ST_URI reference.
	 * @param {string} options.context - context to match.
	 * @param {string} options.action - action to match.
	 * 
	 * @returns {st.net.services.NETservices_Lib.Response_chkST_URI}
	 * 
	 * @throws Exceptions
	 * 
	 */
	check_ST_URI(options) {
		
		if (options === undefined) {
			options = {};
		}

		let _stURI = this;
		if (options.stURI !== undefined) {
			_stURI = options.stURI;
		}
		
		return NETservices_Lib.check_ST_URI({
			'stURI': _stURI,
			'context': options.context,
			'action': options.action
		});
		
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
	 * @param {string} stIRI - The ST URI string
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
		
		// console.log('<~i~> NETservices_Lib.parse_stURI');	// TODO REMOVE DEBUG LOG
		// console.log(' <~> _URIpieces');	// TODO REMOVE DEBUG LOG
		// console.log(_URIpieces);	// TODO REMOVE DEBUG LOG
		// console.log(' <~> _URIschemma');	// TODO REMOVE DEBUG LOG
		// console.log(_URIschema);	// TODO REMOVE DEBUG LOG
		
		
		let _URIcontext = _URIpieces[1];
		let _URIbody = stURI.substr(_URIschema.length + _URIcontext.length + 1);
		
		let _BODYaction = _URIbody.substring(
				1, 
				_URIbody.indexOf('/') );
		
		let _BODYparams = _URIbody.substring( _URIbody.indexOf('/') + 1 );
		
		let _token_START = '['; ;
		let _token_END = ']'; ;
		
		
		let _params = _BODYparams.split( _token_END );	// Split for parameters
		let _paramsFiltered = [];
		
		_paramsFiltered = _params.filter(function(_param, _i) {		// Filter parameters 
			
			if (_param[0] === _token_START) {
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
		
		
	},
	
	
	/**
	 * Return paramerter searched by name
	 * 
	 * @memberof st.net.services.NETservices_Lib
	 * 
	 * @param {object} options - Options object.
	 * @param {st.net.services.stIRI_Param[]} options.params - Array of parameters.
	 * @param {string} options.name - Name for the filter.
	 * 
	 * @returns {st.net.services.stURI_DATA}
	 * @throws Exceptions
	 * 
	 * 
	 */
	'getParamByName': function(options) {
		
		if (options === undefined) {
			options = {};
		}
		
		if (options.params === undefined) {
			throw 'params is required.';
		}
		let _params = options.params;
		
		if (options.name === undefined) {
			throw 'name is required.';
		}
		let _name = options.name;

		let _i = -1;
		let _param = null
		
		_i = _params.map(function(_x) {return _x.name; }).indexOf(_name);
		if (_i !== -1) {
			_param = _params[_i];
		}
		
		return {
			"param": _param,
			"position": _i
		};


	},
	
	
	/**
	 * Return new ST_IRI
	 * 
	 * @memberof st.net.services.NETservices_Lib
	 * 
	 * @param {object} options - Options object.
	 * @param {st.net.services.stURI_DATA} options.stURI_DATA - the stURI_DATA object.
	 * 
	 * @returns {st.net.services.ST_URI}
	 * @throws Exceptions
	 * 
	 * 
	 */
	'getNew_ST_URI': function (options) {
		
		if (options === undefined) {
			options = {};
		}
		
		if (options.stURI_DATA === undefined) {
			throw 'stURI_DATA is required.';
		}
		let _stURI_DATA = options.stURI_DATA;

		let _stIRI = new ST_URI({
			'stURI_DATA': _stURI_DATA
		});
		
		return _stIRI;
		
	},
	
		
	/**
	 * Check ST_URI
	 * 
	 * @memberof st.net.services.NETservices_Lib
	 * 
	 * @param {object} options - Options object.
	 * @param {st.net.services.ST_URI} options.stURI - the ST_URI object.
	 * @param {string} options.context - context to match.
	 * @param {string} options.action - action to match.
	 * 
	 * @returns {st.net.services.NETservices_Lib.Response_chkST_URI}
	 * 
	 * 
	 * @throws Exceptions
	 * 
	 * 
	 */
	'check_ST_URI': function(options) {
		
		/*
		  schema: 'st',
		  context: 'engines',
		  action: 'config',
		*/
		
		if (options === undefined) {
			options = {};
		}

		
		if (options.stURI === undefined) {
			throw 'stURI is required.';
		}
		let stURI = options.stURI;
		
		
		let _response = {
			'checkOK': false,
			'errorMSG': ''
		};
		
		try {
			
			if (stURI.schema !== 'st') {
				throw 'Bad schema';
			}
			
			if (options.context !== undefined && 
					options.context !== stURI.context) {
				throw 'Context not match';
			}
			
			if (options.action !== undefined && 
					options.action !== stURI.action) {
				throw 'Action not match';
			}
			
			
			_response.checkOK = true;
			
		} catch (e) {
			// TODO: handle exception
			
			_response.errorMSG = e;
		}

		return _response;
		
	}
	
	
};





let _lib = {
		
	"NETservices_CONSTANTS": NETservices_CONSTANTS,
	"NETservices_Lib": NETservices_Lib,
	'ST_URI': ST_URI
		
};



module.exports = _lib;