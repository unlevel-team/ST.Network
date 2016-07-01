"use strict";

/**
 * DC_SocketIO library
 * 
 * Provides data channel to ST network based on socket.io
 * 
 * 
 */

/**
 * Import EventEmitter
 * @ignore
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('events').EventEmitter;

/**
 * Import DataChannel
 * @ignore
 */
var DataChannel = require('./DataChannel.js').DataChannel;

/**
 * Import portscanner
 * @ignore
 */
var portscanner = require('portscanner');

/**
 * Import portscanner
 * @ignore
 */
var http = require('http');

/**
 * Data Channel for Socket.io type
 */

var DC_SocketIO = function (_DataChannel) {
	_inherits(DC_SocketIO, _DataChannel);

	function DC_SocketIO(config) {
		_classCallCheck(this, DC_SocketIO);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(DC_SocketIO).call(this, config));
	}

	/**
  * Initialize data channel
  */


	_createClass(DC_SocketIO, [{
		key: 'initDataChannel',
		value: function initDataChannel() {

			var dc = this;

			_get(Object.getPrototypeOf(DC_SocketIO.prototype), 'initDataChannel', this).call(this);

			if (dc.config.socketPort === undefined) {
				throw "Socket port not defined.";
			}

			if (dc.config.netLocation === undefined) {
				throw "Net location not defined.";
			}

			switch (dc.config.mode) {
				case dc.CONSTANTS.Config.modeIN:
					dc.initDC_modeIN();
					break;
				case dc.CONSTANTS.Config.modeOUT:
					dc.initDC_modeOUT();
					break;
				default:
					break;
			}
		}

		/**
   * Initialize mode IN
   */

	}, {
		key: 'initDC_modeIN',
		value: function initDC_modeIN() {

			var dc = this;

			if (dc.server !== null) {
				throw "Server is initialized";
			}

			dc.server = require('socket.io')();

			// Map connection of Socket
			dc.server.on('connection', function (socket) {

				dc.eventEmitter.emit(dc.CONSTANTS.Events.ClientConnected, { "socket": socket }); // Emit event ClientConnected

				// Map disconnection of Socket
				socket.on('disconnect', function () {
					dc.eventEmitter.emit(dc.CONSTANTS.Events.ClientDisconnected, { "socket": socket }); // Emit event ClientDisconnected
				});

				// Map message of Socket
				socket.on(dc.CONSTANTS.Messages.DataMessage, function (msg) {
					dc.eventEmitter.emit(dc.CONSTANTS.Events.MessageReceived, msg); // Emit event MessageReceived
				});
			});

			// Map event MainLoop_Tick
			dc.eventEmitter.on(dc.CONSTANTS.Events.MainLoop_Tick, function () {

				console.log('<*> ST DC_SocketIO.MainLoop_Tick'); // TODO REMOVE DEBUG LOG
				console.log(' <~> ChannelID: ' + dc.config.id); // TODO REMOVE DEBUG LOG
				console.log(dc.messagesList); // TODO REMOVE DEBUG LOG

				// Emit messages to socket
				if (dc.messagesList.length > 0) {
					dc.server.sockets.emit(dc.CONSTANTS.Messages.DataMessage, dc.messagesList);
					dc.messagesList = [];
				}
			});

			// Checks the status of a single port
			portscanner.checkPortStatus(dc.config.socketPort, dc.config.netLocation, function (error, status) {
				// Status is 'open' if currently in use or 'closed' if available
				// console.log(status)

				switch (status) {

					case 'closed':

						// Connect socket.IO to any IP...

						dc._server = http.createServer();
						dc._server.listen(dc.config.socketPort, dc.config.netLocation);

						dc.server.listen(dc._server);

						break;

					default:

						dc.server = null;
						throw "Net location already busy.";

					//				break;
				}
			});

			// Change state to Ready
			dc.state = dc.CONSTANTS.States.DCstate_Ready;

			// Emit event Channel initialized
			dc.eventEmitter.emit(dc.CONSTANTS.Events.ChannelInitialized);
		}

		/**
   * Initialize mode OUT
   */

	}, {
		key: 'initDC_modeOUT',
		value: function initDC_modeOUT() {

			var dc = this;

			if (dc.socket !== null) {
				throw "Socket is initialized";
			}

			dc._serverURL = 'http://' + dc.config.netLocation + ':' + dc.config.socketPort;

			// Map event MainLoop_Tick
			dc.eventEmitter.on(dc.CONSTANTS.Events.MainLoop_Tick, function () {

				console.log('<*> ST DC_SocketIO.MainLoop_Tick'); // TODO REMOVE DEBUG LOG
				console.log(' <~> ChannelID: ' + dc.config.id); // TODO REMOVE DEBUG LOG
				console.log(dc.messagesList); // TODO REMOVE DEBUG LOG

				// Emit messages to socket
				if (dc.messagesList.length > 0) {
					dc.socket.emit(dc.CONSTANTS.Messages.DataMessage, dc.messagesList);
					dc.messagesList = [];
				}
			});

			dc.socket = require('socket.io-client')(dc._serverURL); // connect to server

			//		var socket = new io.Socket();
			//		socket.connect('http://' + ipAddress + ':' + port);

			// Map event connect
			dc.socket.on('connect', function () {
				dc.eventEmitter.emit(dc.CONSTANTS.Events.ChannelConnected); // Emit event ChannelStarted
			});

			// Map event disconnect
			dc.socket.on('disconnect', function () {
				dc.eventEmitter.emit(dc.CONSTANTS.Events.ChannelDisconnected); // Emit event ChannelStop
			});

			// Map message of Socket
			dc.socket.on(dc.CONSTANTS.Messages.DataMessage, function (msg) {
				dc.eventEmitter.emit(dc.CONSTANTS.Events.MessageReceived, msg); // Emit event MessageReceived
			});

			// Change state to Ready
			dc.state = dc.CONSTANTS.States.DCstate_Ready;

			// Emit event Channel initialized
			dc.eventEmitter.emit(dc.CONSTANTS.Events.ChannelInitialized);
		}

		/**
   * Close data channel
   */

	}, {
		key: 'closeDataChannel',
		value: function closeDataChannel() {

			_get(Object.getPrototypeOf(DC_SocketIO.prototype), 'closeDataChannel', this).call(this);

			var dc = this;

			switch (dc.config.mode) {

				case dc.CONSTANTS.Config.modeIN:
					dc.server.close();
					dc.server = null;
					break;

				case dc.CONSTANTS.Config.modeOUT:
					dc.socket.close();
					dc.socket = null;
					break;

				default:
					break;
			}

			// Change state to Config
			dc.state = dc.CONSTANTS.States.DCstate_Config;

			// Emit event ChannelClosed
			dc.eventEmitter.emit(dc.CONSTANTS.Events.ChannelClosed);
		}

		/**
   * Start data channel
   */

	}, {
		key: 'startDataChannel',
		value: function startDataChannel() {

			_get(Object.getPrototypeOf(DC_SocketIO.prototype), 'startDataChannel', this).call(this);

			var dc = this;

			dc.mainLoop();

			// Emit event ChannelClosed
			dc.eventEmitter.emit(dc.CONSTANTS.Events.ChannelStarted);
		}

		/**
   * Stop data channel
   */

	}, {
		key: 'stopDataChannel',
		value: function stopDataChannel() {

			_get(Object.getPrototypeOf(DC_SocketIO.prototype), 'stopDataChannel', this).call(this);

			var dc = this;

			dc.stopMainLoop();
		}
	}]);

	return DC_SocketIO;
}(DataChannel);

module.exports = DC_SocketIO;
//# sourceMappingURL=DC_SocketIO.js.map
