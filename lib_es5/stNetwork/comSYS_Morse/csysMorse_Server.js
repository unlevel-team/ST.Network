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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TBind_Morse = require('./COMsys_Morse.js').TBind_Morse;

/**
 * Import COMSystem_Morse
 * @ignore
 */
var COMSystem_Morse = require('./COMsys_Morse.js').COMSystem_Morse;

/**
 * Import COMSys_Morse_Srv_Server
 * @ignore
 */
var COMSys_Morse_Srv_Server = require('./csysMorse_ServerServices.js').COMSys_Morse_Srv_Server;

/**
 * ThingBind for role Server
 * 
 * @class
 * @memberof st.net.comsys_morse
 * @implements st.net.comsys_morse.TBind_Morse
 * 
 */

var TBind_Morse_Server = function (_TBind_Morse) {
	_inherits(TBind_Morse_Server, _TBind_Morse);

	/**
  * @constructs TBind_Morse_Server
  */

	function TBind_Morse_Server(type, source, target, options) {
		_classCallCheck(this, TBind_Morse_Server);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TBind_Morse_Server).call(this, type, source, target, options));

		_this._bindFunction = null;
		return _this;
	}

	return TBind_Morse_Server;
}(TBind_Morse);

/**
 * Communications System for Server role
 *  
 * @class
 * @memberof st.net.comsys_morse
 * @implements st.net.comsys_morse.COMSystem_Morse
 */


var CSYS_Morse_Server = function (_COMSystem_Morse) {
	_inherits(CSYS_Morse_Server, _COMSystem_Morse);

	/**
  * 
  * @constructs CSYS_Morse_Server
  */

	function CSYS_Morse_Server(config) {
		_classCallCheck(this, CSYS_Morse_Server);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(CSYS_Morse_Server).call(this, config));
	}

	/**
  * Initialize
  */


	_createClass(CSYS_Morse_Server, [{
		key: 'initialize',
		value: function initialize() {

			_get(Object.getPrototypeOf(CSYS_Morse_Server.prototype), 'initialize', this).call(this);

			var comSYS = this;
			//		let config = comSYS.config;

			comSYS._service = new COMSys_Morse_Srv_Server(comSYS);
		}
	}]);

	return CSYS_Morse_Server;
}(COMSystem_Morse);

var cysMorse_roleServer_Lib = {
	"TBind_Morse_Server": TBind_Morse_Server,
	"CSYS_Morse_Server": CSYS_Morse_Server
};

module.exports = cysMorse_roleServer_Lib;
//# sourceMappingURL=csysMorse_Server.js.map
