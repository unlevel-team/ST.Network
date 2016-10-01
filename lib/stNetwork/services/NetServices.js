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
 * The stIRI_DATA object.
 * 
 * @typedef {Object} stIRI_DATA
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
 * The stIRI_DATA_Param object.
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
	 * @param {st.net.services.stIRI_DATA} [options.stIRI_DATA] - ST URI DATA object
	 * 
	 */
	constructor(options) {
		
		if (options === undefined ||
				options === null) {
			options = {};
		}
		
		let stIRI = this;
		stIRI.stIRI = null;
		stIRI.schema = null;
		stIRI.context = null;
		stIRI.action = null;
		stIRI.params = [];
		
		
		if (options.stIRI_DATA !== undefined) {
			
			let uriDATA = options.stIRI_DATA;
			
			stIRI.stIRI = uriDATA.stIRI;
			stIRI.schema = uriDATA.schema;
			stIRI.context = uriDATA.context;
			stIRI.action = uriDATA.action;
			stIRI.params = uriDATA.params;
			
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
		
		let _stIRI = this;
		if (options.stIRI !== undefined) {
			_stIRI = options.stIRI;
		}
		
		if (options.name === undefined) {
			throw 'name is required.';
		}
		let _name = options.name;

		
		return NETservices_Lib.getParamByName({
			'params': _stIRI.params,
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
	check_ST_IRI(options) {
		
		if (options === undefined) {
			options = {};
		}

		let _stIRI = this;
		if (options.stIRI !== undefined) {
			_stIRI = options.stIRI;
		}
		
		return NETservices_Lib.check_ST_IRI({
			'stIRI': _stIRI,
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
	 * @returns {st.net.services.stIRI_DATA}
	 * @throws Exceptions
	 * 
	 */
	"parse_stIRI": function (stIRI, options) {
		
		if (options === undefined ||
				options === null) {
			options = {};
		}
		
		
		let _URIpieces = stIRI.split(':');
		let _URIschema = _URIpieces[0];
		
		if (_URIschema !== 'st') {
			throw "Bad URI";
		}
		
		console.log('<~i~> NETservices_Lib.parse_stIRI');	// TODO REMOVE DEBUG LOG
		console.log(' <~> _URIpieces');	// TODO REMOVE DEBUG LOG
		console.log(_URIpieces);	// TODO REMOVE DEBUG LOG
		console.log(' <~> _URIschemma');	// TODO REMOVE DEBUG LOG
		console.log(_URIschema);	// TODO REMOVE DEBUG LOG
		
		
		let _URIcontext = _URIpieces[1];
		let _URIbody = stIRI.substr(_URIschema.length + _URIcontext.length + 1);
		
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
		
		
		
		let stIRI_DATA = {
				
			"stIRI": stIRI,
			"schema": _URIschema,
			"context": _URIcontext,
			"action": _BODYaction,
			"params": params
		};
		
		return stIRI_DATA;
		
		
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
	 * @returns {st.net.services.stIRI_DATA}
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
	 * @param {st.net.services.stIRI_DATA} options.stIRI_DATA - the stIRI_DATA object.
	 * 
	 * @returns {st.net.services.ST_URI}
	 * @throws Exceptions
	 * 
	 * 
	 */
	'getNew_ST_IRI': function (options) {
		
		if (options === undefined) {
			options = {};
		}
		
		if (options.stIRI_DATA === undefined) {
			throw 'stIRI_DATA is required.';
		}
		let _stIRI_DATA = options.stIRI_DATA;

		let _stIRI = new ST_URI({
			'stIRI_DATA': _stIRI_DATA
		});
		
		return _stIRI;
		
	},
	
		
	/**
	 * Check ST_URI
	 * 
	 * @memberof st.net.services.NETservices_Lib
	 * 
	 * @param {object} options - Options object.
	 * @param {st.net.services.ST_URI} options.stIRI - the ST_URI object.
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
	'check_ST_IRI': function(options) {
		
		/*
		  schema: 'st',
		  context: 'engines',
		  action: 'config',
		*/
		
		if (options === undefined) {
			options = {};
		}

		
		if (options.stIRI === undefined) {
			throw 'stIRI is required.';
		}
		let stIRI = options.stIRI;
		
		
		let _response = {
			'checkOK': false,
			'errorMSG': ''
		};
		
		try {
			
			if (stIRI.schema !== 'st') {
				throw 'Bad schema';
			}
			
			if (options.context !== undefined && 
					options.context !== stIRI.context) {
				throw 'Context not match';
			}
			
			if (options.action !== undefined && 
					options.action !== stIRI.action) {
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