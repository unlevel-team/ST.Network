"use strict";

/**
 * COMSystem library
 * <pre>
 * for role Node
 * 
 * Provides communications system to ST network
 * 
 * 
 * v. Morse
 * </pre>
 * 
 * @ignore
 */

/**
 * Import TBind_Morse_Node
 * @ignore
 */

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TBind_Morse_Node = require('./csysMorse_Node.js').CSYS_Morse_Node;

/**
 * Import TBind_Morse_Service
 * @ignore
 */
var TBind_Morse_Service = require('./csysMorse_Services.js').TBind_Morse_Service;

/**
 * Import COMSys_Morse_Service
 * @ignore
 */
var COMSys_Morse_Service = require('./csysMorse_Services.js').COMSys_Morse_Service;

/**
 * Bind Service
 * <pre>
 * Role Node
 * </pre>
 * 
 * @class
 * @memberof st.net.comsys_morse
 * @implements st.net.comsys_morse.TBind_Morse_Service
 */

var TBind_Morse_Srv_Node = function (_TBind_Morse_Service) {
	_inherits(TBind_Morse_Srv_Node, _TBind_Morse_Service);

	/**
  * @constructs TBind_Morse_Srv_Node
  */

	function TBind_Morse_Srv_Node(comSYS, tBind) {
		_classCallCheck(this, TBind_Morse_Srv_Node);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(TBind_Morse_Srv_Node).call(this, comSYS, tBind));
	}

	/**
  * Event Unbind
  */


	_createClass(TBind_Morse_Srv_Node, [{
		key: '_event_Unbind',
		value: function _event_Unbind(data) {

			var service = this;
			var tBind = service.tBind;

			var comSYS = service.comSYS;
			var _config = comSYS.config;

			var socket = _config.controlChannel.socket;

			var synchro = data.synchro;
			var options = data.options;

			if (synchro) {

				// Send Message BindFree
				socket.emit(comSYS.CONSTANTS.Messages.BindFree, {
					"bindID": tBind.bindID,
					"type": tBind.type
				});
			}
		}
	}]);

	return TBind_Morse_Srv_Node;
}(TBind_Morse_Service);

/**
 * Communications System Service
 * <pre>
 * Role Node
 * </pre>
 * 
 * @class
 * @memberof st.net.comsys_morse
 * @implements st.net.comsys_morse.COMSys_Morse_Service
 * 
 * 
 */


var COMSys_Morse_Srv_Node = function (_COMSys_Morse_Service) {
	_inherits(COMSys_Morse_Srv_Node, _COMSys_Morse_Service);

	/**
  * @construct COMSys_Morse_Srv_Node
  */

	function COMSys_Morse_Srv_Node(comSYS) {
		_classCallCheck(this, COMSys_Morse_Srv_Node);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(COMSys_Morse_Srv_Node).call(this, comSYS));
	}

	/**
  * Map control messages
  */


	_createClass(COMSys_Morse_Srv_Node, [{
		key: 'mapControlMessages',
		value: function mapControlMessages(socket) {

			_get(Object.getPrototypeOf(COMSys_Morse_Srv_Node.prototype), 'mapControlMessages', this).call(this, socket);

			var service = this;

			var comSYS = service.comSYS;
			var _config = comSYS.config;

			if (socket === undefined) {
				socket = _config.controlChannel.socket;
			}

			// Map message createBind
			socket.on(comSYS.CONSTANTS.Messages.createBind, function (msg) {
				service._msg_createBind(msg, socket, {
					"bindID": msg.bindID,
					"type": msg.type,
					"source": msg.source,
					"target": msg.target

				});
			});
		}

		/**
   * Event Bind_Added
   */

	}, {
		key: '_event_Bind_Added',
		value: function _event_Bind_Added(data) {

			var service = this;

			var comSYS = service.comSYS;
			var _config = comSYS.config;

			var socket = _config.controlChannel.socket;

			var synchro = data.synchro;
			var bind = data.bind;
			var options = data.options;

			if (synchro) {

				// Send Message Bind_Created
				socket.emit(comSYS.CONSTANTS.Messages.Bind_Created, {
					"bindID": bind.bindID,
					"type": bind.type
				});
			}
		}

		/**
   * Message createBind
   */

	}, {
		key: '_msg_createBind',
		value: function _msg_createBind(msg, socket, options) {

			var service = this;

			var comSYS = service.comSYS;
			var _config = comSYS.config;

			var type = options.type;
			var source = options.source;
			var target = options.target;
			var _options = {
				"bindID": options.bindID
			};

			console.log('<*> ST COMSys_Morse_Service._msg_createBind'); // TODO REMOVE DEBUG LOG

			var tbind = new TBind_Morse_Node(type, source, target, _options);

			try {
				tbind.initialize();
				comSYS.addBind(tbind);
			} catch (e) {
				console.log('<EEE> ST COMSys_Morse_Service._msg_createBind'); // TODO REMOVE DEBUG LOG
				console.log(e); // TODO REMOVE DEBUG LOG

				// Notify Error
				service.sendErrorInfo(socket, "Net.Bind", e, {
					"controlMSG": comSYS.CONSTANTS.Messages.createBind,
					"msg": msg,
					"options": options
				});
			}
		}
	}]);

	return COMSys_Morse_Srv_Node;
}(COMSys_Morse_Service);

var cysMorseSrv_Node_Lib = {
	"TBind_Morse_Srv_Node": TBind_Morse_Srv_Node,
	"COMSys_Morse_Srv_Node": COMSys_Morse_Srv_Node
};

module.exports = cysMorseSrv_Node_Lib;
//# sourceMappingURL=csysMorse_NodeServices.js.map
