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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataMessage = require('../DataChannel.js').DataMessage;

/**
 * import TBind_Morse
 * @ignore
 */
var TBind_Morse = require('./COMsys_Morse.js').TBind_Morse;

/**
 * import COMSystem_Morse
 * @ignore
 */
var COMSystem_Morse = require('./COMsys_Morse.js').COMSystem_Morse;

/**
 * import COMSys_Morse_Srv_Node
 * @ignore
 */
var COMSys_Morse_Srv_Node = require('./csysMorse_NodeServices.js').COMSys_Morse_Srv_Node;

/**
 * ThingBind for role Node
 * 
 * @class
 * @implements TBind_Morse
 * 
 */

var TBind_Morse_Node = function (_TBind_Morse) {
	_inherits(TBind_Morse_Node, _TBind_Morse);

	/**
  * @constructs TBind_Morse_Node
  * 
  * @param {string} type - Type of bind
  * @param {object} source - Source
  * @param {object} target - Target
  * @param {object} options - Options object
  * 
  */

	function TBind_Morse_Node(type, source, target, options) {
		_classCallCheck(this, TBind_Morse_Node);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(TBind_Morse_Node).call(this, type, source, target, options));
	}

	/**
  * Bind DC to Sensor
  */


	_createClass(TBind_Morse_Node, [{
		key: '_init_DCtoSensor',
		value: function _init_DCtoSensor() {

			var tbind = this;

			var dc = tbind.target;
			var sensor = tbind.source;

			if (tbind.options === undefined || tbind.options.bindID === undefined) {
				throw "This bind requires an ID.";
			}

			tbind.bindID = tbind.CONSTANTS.Config.BindType_DCtoSensor + tbind.options.bindID; // Set bind ID

			// Define bind function
			tbind._bindFunction = function (data) {

				if (tbind.state !== tbind.CONSTANTS.States.State_Working) {
					return;
				}

				if (tbind.options.bindFunction) {
					tbind.options.bindFunction(data);
				}

				var msg = new DataMessage(data);
				msg.typeExtra = tbind.CONSTANTS.Config.Version;
				msg._Morse = {
					"bindID": tbind.bindID
				};

				dc.sendMessage(msg);
			};

			// Map event SensorData
			sensor.eventEmitter.on(sensor.CONSTANTS.Events.SensorData, tbind._bindFunction);

			tbind.state = tbind.CONSTANTS.States.State_Ready;
		}

		/**
   * Bind DC to Actuator
   */

	}, {
		key: '_init_DCtoActuator',
		value: function _init_DCtoActuator() {

			var tbind = this;
			var dc = tbind.source;
			var actuator = tbind.target;

			if (tbind.options === undefined || tbind.options.bindID === undefined) {
				throw "This bind requires an ID.";
			}

			if (tbind.options.comSYS === undefined) {
				throw "This bind requires a comSYS.";
			}

			var comSYS = tbind.options.comSYS;

			tbind.bindID = tbind.CONSTANTS.Config.BindType_DCtoActuator + tbind.options.bindID; // Set bind ID

			// Define bind function
			tbind._bindFunction = function (data) {

				if (tbind.state !== tbind.CONSTANTS.States.State_Working) {
					return;
				}

				if (tbind.options.bindFunction) {
					tbind.options.bindFunction(data);
				}

				actuator.emit(actuator.CONSTANTS.Events.ActuatorData, data); // Emit event ActuatorData
			};

			comSYS.bindDC(dc); // Bind Communications system to DC

			// Map event `bindID`
			comSYS.eventEmitter.on(tbind.bindID, tbind._bindFunction);
		}

		/**
   * Unbind
   */

	}, {
		key: 'unbind',
		value: function unbind() {

			var tbind = this;

			switch (tbind.type) {

				case tbind.CONSTANTS.Config.BindType_DCtoSensor:

					var sensor = tbind.target;

					// UnMap event SensorData
					sensor.eventEmitter.removeListener(sensor.CONSTANTS.Events.SensorData, tbind._bindFunction);
					break;

				case tbind.CONSTANTS.Config.BindType_DCtoActuator:

					var comSYS = tbind.options.comSYS;

					// UnMap event `bindID`
					comSYS.eventEmitter.removeListener(tbind.bindID, tbind._bindFunction);
					break;

				default:
					break;

			}

			_get(Object.getPrototypeOf(TBind_Morse_Node.prototype), 'unbind', this).call(this);
		}
	}]);

	return TBind_Morse_Node;
}(TBind_Morse);

/**
 * Communications System for Node role
 * 
 * @class
 * @implements COMSystem_Morse
 *  
 */


var CSYS_Morse_Node = function (_COMSystem_Morse) {
	_inherits(CSYS_Morse_Node, _COMSystem_Morse);

	/**
  * 
  * @constructs CSYS_Morse_Node
  * 
  * @param {object} config - Configuration object
  * 
  */

	function CSYS_Morse_Node(config) {
		_classCallCheck(this, CSYS_Morse_Node);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(CSYS_Morse_Node).call(this, config));
	}

	/**
  * Initialize
  */


	_createClass(CSYS_Morse_Node, [{
		key: 'initialize',
		value: function initialize() {

			_get(Object.getPrototypeOf(CSYS_Morse_Node.prototype), 'initialize', this).call(this);

			var comSYS = this;
			var _config = comSYS.config;

			comSYS._service = new COMSys_Morse_Srv_Node(comSYS);
		}
	}]);

	return CSYS_Morse_Node;
}(COMSystem_Morse);

var cysMorse_roleNode_Lib = {
	"TBind_Morse_Node": TBind_Morse_Node,
	"CSYS_Morse_Node": CSYS_Morse_Node
};

module.exports = cysMorse_roleNode_Lib;
//# sourceMappingURL=csysMorse_Node.js.map
