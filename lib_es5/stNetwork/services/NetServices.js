"use strict";

/*
 SomeThings Network services library

*/

/**
 * Network service constants
 * 
 * @memberof st.net.services
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NETservices_CONSTANTS = {

	"Messages": {
		"getNetInfo": "Get Net Info",
		"NetInfo": "Net Info",

		"createDataChannel": "Create DC",
		"DataChannelCreated": "DC Created",

		"deleteDataChannel": "Delete DC",
		"DataChannelDeleted": "DC Deleted",

		"getDataChannelOptions": "get DC Options",
		"DataChannelOptions": "DC Options",

		"SetDCOptions": "Set DC Options",
		"DCOptionsUpdated": "DC Options Updated",

		"initDC": "Init DC",
		"DCInitialized": "DC Initialized",

		"closeDC": "Close DC",
		"DCClosed": "DC Closed",

		"startDataChannel": "Start DC",
		"DataChannelStarted": "DC started",

		"stopDataChannel": "Stop DC",
		"DataChannelStopped": "DC Stopped"

	},

	"Events": {
		"DataChannelCreated": "DC Created"

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

var ST_URI = function () {

	/**
  * 
  * @constructs ST_URI
  * 
  * @param {object} [options] - Options object
  * @param {st.net.services.stURI_DATA} [options.stURI_DATA] - ST URI DATA object
  * 
  */

	function ST_URI(options) {
		_classCallCheck(this, ST_URI);

		if (options === undefined || options === null) {
			options = {};
		}

		var stURI = this;
		stURI.stURI = null;
		stURI.schema = null;
		stURI.context = null;
		stURI.action = null;
		stURI.params = [];

		if (options.stURI_DATA !== undefined) {

			var uriDATA = options.stURI_DATA;

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


	_createClass(ST_URI, [{
		key: "getParameterByName",
		value: function getParameterByName(name, options) {

			var stURI = this;

			if (options === undefined || options === null) {
				options = {};
			}

			if (options.stURI !== undefined) {
				stURI = options.stURI;
			}

			var param = null;
			var _i = -1;

			_i = stURI.params.map(function (x) {
				return x.name;
			}).indexOf(name);

			if (_i !== -1) {
				param = stURI.params[_i];
			}

			return {
				"param": param,
				"position": _i
			};
		}
	}]);

	return ST_URI;
}();

/**
 * NET services library
 * 
 * @namespace NETservices_Lib
 * @memberof st.net.services
 * 
 */


var NETservices_Lib = {

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
	"parse_stURI": function parse_stURI(stURI, options) {

		if (options === undefined || options === null) {
			options = {};
		}

		var _URIpieces = stURI.split(':');
		var _URIschema = _URIpieces[0];

		if (_URIschema !== 'st') {
			throw "Bad URI";
		}

		console.log('<~i~> NETservices_Lib.parse_stURI'); // TODO REMOVE DEBUG LOG
		console.log(' <~> _URIpieces'); // TODO REMOVE DEBUG LOG
		console.log(_URIpieces); // TODO REMOVE DEBUG LOG
		console.log(' <~> _URIschemma'); // TODO REMOVE DEBUG LOG
		console.log(_URIschema); // TODO REMOVE DEBUG LOG

		var _URIcontext = _URIpieces[1];
		var _URIbody = stURI.substr(_URIschema.length + _URIcontext.length + 1);

		var _BODYaction = _URIbody.substring(1, _URIbody.indexOf('/'));

		var _BODYparams = _URIbody.substring(_URIbody.indexOf('/') + 1);

		var _params = _BODYparams.split(']'); // Split for parameters
		var _paramsFiltered = [];

		_paramsFiltered = _params.filter(function (_param, _i) {
			// Filter parameters

			if (_param[0] === '[') {
				return true;
			}
		});

		var params = [];
		_paramsFiltered.forEach(function (_param, _i) {
			// Add parameters

			var param = {};
			param.name = _param.substring(1, _param.indexOf('='));
			param.value = _param.substring(_param.indexOf('=') + 1);
			params.push(param);
		});

		var stURI_DATA = {

			"stURI": stURI,
			"schema": _URIschema,
			"context": _URIcontext,
			"action": _BODYaction,
			"params": params
		};

		return stURI_DATA;
	}

};

var _lib = {

	"NETservices_CONSTANTS": NETservices_CONSTANTS,
	"NETservices_Lib": NETservices_Lib

};

module.exports = _lib;
//# sourceMappingURL=NetServices.js.map
