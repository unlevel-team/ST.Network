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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TBind_Morse = require("./COMsys_Morse.js").TBind_Morse;

/**
 * Bind Service
 */

var TBind_Morse_Service = function () {
	function TBind_Morse_Service(comSYS, tBind) {
		_classCallCheck(this, TBind_Morse_Service);

		this.comSYS = comSYS;
		this.tBind = tBind;
		this.CONSTANTS = comSYS.CONSTANTS;
	}

	_createClass(TBind_Morse_Service, [{
		key: "initialize",
		value: function initialize() {

			var service = this;
			service.mapControlEvents();
		}

		/**
   * Map control events
   */

	}, {
		key: "mapControlEvents",
		value: function mapControlEvents() {

			var service = this;
			var tBind = service.tBind;

			var comSYS = service.comSYS;
			var _config = comSYS.config;

			var socket = _config.controlChannel.socket;

			// Map event Unbind
			tBind.eventEmitter.on(tBind.CONSTANTS.Events.Unbind, service._event_Unbind);

			// Map event Bind_Started
			tBind.eventEmitter.on(tBind.CONSTANTS.Events.Bind_Started, service._event_Bind_Started);
		}

		/**
   * Event Bind_Started
   */

	}, {
		key: "_event_Bind_Started",
		value: function _event_Bind_Started(data) {

			var service = this;
			var tBind = service.tBind;

			var comSYS = service.comSYS;
			var _config = comSYS.config;

			var socket = _config.controlChannel.socket;

			var synchro = data.synchro;
			var options = data.options;
		}

		/**
   * Event Unbind
   */

	}, {
		key: "_event_Unbind",
		value: function _event_Unbind(data) {}
	}]);

	return TBind_Morse_Service;
}();

/**
 * Communications System Service
 */


var COMSys_Morse_Service = function () {
	function COMSys_Morse_Service(comSYS) {
		_classCallCheck(this, COMSys_Morse_Service);

		this.comSYS = comSYS;
		this.CONSTANTS = comSYS.CONSTANTS;
	}

	_createClass(COMSys_Morse_Service, [{
		key: "initialize",
		value: function initialize() {

			var service = this;
			service.mapControlEvents();
			service.mapControlMessages();
		}

		/**
   * Map control events
   */

	}, {
		key: "mapControlEvents",
		value: function mapControlEvents(socket) {

			var service = this;

			var comSYS = service.comSYS;
			var _config = comSYS.config;

			if (socket === undefined) {
				socket = _config.controlChannel.socket;
			}

			// Map event Bind_Added
			comSYS.eventEmitter.on(comSYS.CONSTANTS.Events.Bind_Added, service._event_Bind_Added);
		}

		/**
   * Map control messages
   */

	}, {
		key: "mapControlMessages",
		value: function mapControlMessages(socket) {

			var service = this;

			var comSYS = service.comSYS;
			var _config = comSYS.config;

			if (socket === undefined) {
				socket = _config.controlChannel.socket;
			}

			// Map message getBindList
			socket.on(comSYS.CONSTANTS.Messages.getBindList, function (msg) {
				service._msg_getBindList(msg, socket, {
					"filter": msg.filter
				});
			});

			// Map message ErrorInfo
			socket.on(comSYS.CONSTANTS.Messages.ErrorInfo, function (msg) {
				service._msg_ErrorInfo(msg, socket, {
					"msgError": msg
				});
			});
		}

		/**
   * Send ErrorInfo message
   */

	}, {
		key: "sendErrorInfo",
		value: function sendErrorInfo(socket, context, msg, data) {

			var service = this;

			var comSYS = service.comSYS;
			var _config = comSYS.config;

			//		let socket = _config.controlChannel.socket;

			var message = {
				"context": context,
				"msg": msg,
				"data": data
			};

			socket.emit(service.CONSTANTS.Messages.ErrorInfo, message); // Emit message BindList
		}

		/**
   * Event Bind_Added
   */

	}, {
		key: "_event_Bind_Added",
		value: function _event_Bind_Added(data) {}

		/**
   * Message ErrorInfo
   */

	}, {
		key: "_msg_ErrorInfo",
		value: function _msg_ErrorInfo(msg, socket, options) {

			console.log('<*> ST COMSys_Morse_Service._msg_ErrorInfo'); // TODO REMOVE DEBUG LOG
			console.log(msg);
		}

		/**
   * Message getBindList
   */

	}, {
		key: "_msg_getBindList",
		value: function _msg_getBindList(msg, socket, options) {

			var service = this;

			var comSYS = service.comSYS;
			var _config = comSYS.config;

			console.log('<*> ST COMSys_Morse_Service._msg_getBindList'); // TODO REMOVE DEBUG LOG

			var message = {
				"bindsList": [],
				"binds": comSYS.thingsBindings.length
			};

			comSYS.thingsBindings.forEach(function (_bind, _i) {

				var bindInfo = {
					"bindID": _bind.bindID,
					"type": _bind.type,
					"state": _bind.state
				};

				message.bindsList.push(bindInfo);
			});

			socket.emit(service.CONSTANTS.Messages.BindList, message); // Emit message BindList
		}
	}]);

	return COMSys_Morse_Service;
}();

var cysMorseSrv_Lib = {
	"TBind_Morse_Service": TBind_Morse_Service,
	"COMSys_Morse_Service": COMSys_Morse_Service
};

module.exports = cysMorseSrv_Lib;
//# sourceMappingURL=csysMorse_Services.js.map
