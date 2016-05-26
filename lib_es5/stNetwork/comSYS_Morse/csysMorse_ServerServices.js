"use strict";

/**
 * COMSystem library
 * for role Server
 * 
 * Provides communications system to ST network
 * 
 * 
 * v. Morse
 */

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TBind_Morse_Server = require('./csysMorse_Server.js').TBind_Morse_Server;

var TBind_Morse_Service = require('./csysMorse_Services.js').TBind_Morse_Service;
var COMSys_Morse_Service = require('./csysMorse_Services.js').COMSys_Morse_Service;

/**
 * Bind Service
 * Role Server
 */

var TBind_Morse_Srv_Server = function (_TBind_Morse_Service) {
	_inherits(TBind_Morse_Srv_Server, _TBind_Morse_Service);

	function TBind_Morse_Srv_Server(comSYS, tBind) {
		_classCallCheck(this, TBind_Morse_Srv_Server);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(TBind_Morse_Srv_Server).call(this, comSYS, tBind));
	}

	/**
  * Event Unbind
  */


	_createClass(TBind_Morse_Srv_Server, [{
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

				// Send Message UnBind
				socket.emit(comSYS.CONSTANTS.Messages.UnBind, {
					"bindID": options.bindID
				});
			}
		}
	}]);

	return TBind_Morse_Srv_Server;
}(TBind_Morse_Service);

/**
 * Communications System Service
 * Role Server
 */


var COMSys_Morse_Srv_Server = function (_COMSys_Morse_Service) {
	_inherits(COMSys_Morse_Srv_Server, _COMSys_Morse_Service);

	function COMSys_Morse_Srv_Server(comSYS) {
		_classCallCheck(this, COMSys_Morse_Srv_Server);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(COMSys_Morse_Srv_Server).call(this, comSYS));
	}

	/**
  * Map control messages
  */


	_createClass(COMSys_Morse_Srv_Server, [{
		key: 'mapControlMessages',
		value: function mapControlMessages(socket) {

			_get(Object.getPrototypeOf(COMSys_Morse_Srv_Server.prototype), 'mapControlMessages', this).call(this, socket);

			var service = this;

			var comSYS = service.comSYS;
			var _config = comSYS.config;

			if (socket === undefined) {
				socket = _config.controlChannel.socket;
			}

			// Map message Bind_Created
			socket.on(comSYS.CONSTANTS.Messages.Bind_Created, function (msg) {
				service._msg_Bind_Created(msg, socket, {
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

				// Send Message createBind
				socket.emit(comSYS.CONSTANTS.Messages.createBind, {
					"bindID": options.bindID,
					"type": options.type,
					"source": options.source,
					"target": options.target
				});
			}
		}

		/**
   * Message Bind_Created
   */

	}, {
		key: '_msg_Bind_Created',
		value: function _msg_Bind_Created(msg, socket, options) {

			var service = this;

			var comSYS = service.comSYS;
			var _config = comSYS.config;

			var type = options.type;
			var source = options.source;
			var target = options.target;
			var _options = {
				"bindID": options.bindID
			};

			var bindID = options.bindID;

			console.log('<*> ST COMSys_Morse_Service._msg_Bind_Created'); // TODO REMOVE DEBUG LOG

			try {

				var tbindSearch = comSYS.getBindByID(bindID);
				if (tbindSearch.tbind === null) {
					throw "Bind not found.";
				}

				var tbind = tbindSearch.tbind;

				//			tbind.initialize();
				//			comSYS.addBind(tbind);
			} catch (e) {

				console.log('<EEE> ST COMSys_Morse_Service._msg_createBind'); // TODO REMOVE DEBUG LOG
				console.log(e); // TODO REMOVE DEBUG LOG

				// Notify Error
				service.sendErrorInfo(socket, "Net.Bind", e, {
					"controlMSG": comSYS.CONSTANTS.Messages.Bind_Created,
					"msg": msg,
					"options": options
				});
			}
		}
	}]);

	return COMSys_Morse_Srv_Server;
}(COMSys_Morse_Service);

var cysMorseSrv_Server_Lib = {
	"TBind_Morse_Srv_Server": TBind_Morse_Srv_Server,
	"COMSys_Morse_Srv_Server": COMSys_Morse_Srv_Server
};

module.exports = cysMorseSrv_Server_Lib;
//# sourceMappingURL=csysMorse_ServerServices.js.map
