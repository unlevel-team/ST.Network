"use strict";

/**
 * COMSystem library
 * 
 * Provides communications system to ST network
 * 
 * 
 * v. Morse
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataMessage = require('../DataChannel.js').DataMessage;

var ThingBind = require('../COMSystem.js').ThingBind;
var COMSystem = require('../COMSystem.js').COMSystem;

var COMSystem_CONSTANTS = require('../COMSystem.js').COMSystem_CONSTANTS;

var COMSystem_Morse_CONSTANTS = {
	"Config": {
		"Version": "Morse"
	}
};

/**
 * TBind_Morse
 */

var TBind_Morse = function (_ThingBind) {
	_inherits(TBind_Morse, _ThingBind);

	function TBind_Morse(type, source, target, options) {
		_classCallCheck(this, TBind_Morse);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TBind_Morse).call(this, type, source, target, options));

		_this._bindFunction = null;
		return _this;
	}

	/**
  * Start Bind
  */


	_createClass(TBind_Morse, [{
		key: 'start',
		value: function start() {

			var tbind = this;

			if (tbind.state !== tbind.CONSTANTS.States.State_Ready) {
				throw "Bad Bind state";
			}

			_get(Object.getPrototypeOf(TBind_Morse.prototype), 'start', this).call(this);
		}

		/**
   * Stop Bind
   */

	}, {
		key: 'stop',
		value: function stop() {

			var tbind = this;

			if (tbind.state !== tbind.CONSTANTS.States.State_Working) {
				throw "Bad Bind state";
			}

			_get(Object.getPrototypeOf(TBind_Morse.prototype), 'stop', this).call(this);
		}
	}]);

	return TBind_Morse;
}(ThingBind);

/**
 * Communications System
 * 
 * Requires role configuration. (Server | Node)
 * 
 */


var COMSystem_Morse = function (_COMSystem) {
	_inherits(COMSystem_Morse, _COMSystem);

	function COMSystem_Morse(config) {
		_classCallCheck(this, COMSystem_Morse);

		var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(COMSystem_Morse).call(this, config));

		_this2.MorseCONSTANTS = COMSystem_Morse_CONSTANTS;

		_this2._service = null;

		_this2.CONSTANTS.Config.Version = COMSystem_Morse_CONSTANTS.Config.Version;

		return _this2;
	}

	_createClass(COMSystem_Morse, [{
		key: 'initialize',
		value: function initialize() {

			_get(Object.getPrototypeOf(COMSystem_Morse.prototype), 'initialize', this).call(this);

			var comSYS = this;
			var _config = comSYS.config;

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

	}, {
		key: '_init_RoleNode',
		value: function _init_RoleNode() {

			var comSYS = this;
			var _config = comSYS.config;

			if (_config.controlChannel === undefined) {
				throw "controlChannel is required.";
			}

			//		comSYS._service = new COMSys_Morse_Srv_Node(comSYS);
		}

		/**
   * Initialize Server role
   */

	}, {
		key: '_init_RoleServer',
		value: function _init_RoleServer() {

			var comSYS = this;
			var _config = comSYS.config;

			//		comSYS._service = new COMSys_Morse_Srv_Server(comSYS);
		}

		/**
   * Bind data channel
   */

	}, {
		key: 'bindDC',
		value: function bindDC(dc) {

			var comSYS = this;

			if (dc.config._comSYS_Morse !== undefined && dc.config._comSYS_Morse !== null) {
				return;
			}

			dc.config._comSYS_Morse = true;

			// Map event MessageReceived
			dc.eventEmitter.on(dc.CONSTANTS.Events.MessageReceived, comSYS._DC_Message);
		}

		/**
   * Unbind data channel
   */

	}, {
		key: 'unbindDC',
		value: function unbindDC(dc) {

			var comSYS = this;

			if (dc.config._comSYS_Morse === undefined || dc.config._comSYS_Morse === null) {
				return;
			}

			// UnMap event MessageReceived
			dc.eventEmitter.removeListener(dc.CONSTANTS.Events.MessageReceived, comSYS._DC_Message);

			dc.config._comSYS_Morse = null;
		}

		/**
   * Data channel message
   */

	}, {
		key: '_DC_Message',
		value: function _DC_Message(msg) {

			var comSYS = this;

			var messages = msg.filter(function (_msg, _i) {
				if (_msg.typeExtra !== undefined && _msg.typeExtra === comSYS.CONSTANTS.Config.Version) {
					return true;
				}
			});

			messages.forEach(function (_msg, _i) {
				comSYS.eventEmitter.emit(_msg._Morse.bindID, _msg); // Emit event {bindID}
			});
		}
	}]);

	return COMSystem_Morse;
}(COMSystem);

/**
 * Get COMSystem
 */


var getCOMSystem = function getCOMSystem(config) {

	if (config.role === undefined) {
		throw "role is required.";
	}

	var comSystem = null;

	switch (config.role) {

		case COMSystem_CONSTANTS.Config.Role_Node:

			var CSYS_Morse_Node = require('./csysMorse_Node.js').CSYS_Morse_Node;
			comSystem = new CSYS_Morse_Node(config);
			break;

		case COMSystem_CONSTANTS.Config.Role_Server:

			var CSYS_Morse_Server = require('./csysMorse_Server.js').CSYS_Morse_Server;
			comSystem = new CSYS_Morse_Server(config);
			break;

		default:
			throw "Bad Role.";
		//			break;
	}

	return comSystem;
};

var cysMorse_Lib = {
	"TBind_Morse": TBind_Morse,
	"COMSystem_Morse": COMSystem_Morse,

	"getCOMSystem": getCOMSystem
};

module.exports = cysMorse_Lib;
//# sourceMappingURL=COMsys_Morse.js.map
