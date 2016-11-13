"use strict";

/**
 * DataChannel library
 *
 * Provides data channels to ST network
 *
 *
 */

/**
 * Import EventEmitter
 * @ignore
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = require('events').EventEmitter;

/**
 * DataChannel CONSTANTS
 * 
 * @memberof st.net
 * 
 * @property {object} Config - Configuration
 * @property {string} Config.DCtype_socketio - DC type socketio
 * @property {string} Config.DCtype_udp - DC type UDP
 * @property {string} Config.MSGType_Normal - MSG type normal
 * @property {string} Config.DataType_JSON - DATA type JSON
 * @property {string} Config.modeIN - Mode IN
 * @property {string} Config.modeOUT - Mode OUT
 * 
 * 
 * @property {object} States - States
 * @property {object} States.DCstate_Config - Config state
 * @property {object} States.DCstate_Ready - Ready state
 * @property {object} States.DCstate_Working - Working state
 * @property {object} States.DCstate_Stop - Stop state
 * 
 * 
 */
var DataChannel_CONSTANTS = {
	"Config": {
		"DCtype_socketio": "socketio",
		"DCtype_udp": "udp",

		"MSGType_Normal": "normal",
		"DataType_JSON": "json",

		"modeIN": "input",
		"modeOUT": "output"

	},

	"States": {
		"DCstate_Config": "config",
		"DCstate_Ready": "ready",
		"DCstate_Working": "working",
		"DCstate_Stop": "stop"
	},

	"Events": {
		"ChannelConnected": "Channel connected",
		"ChannelDisconnected": "Channel disconnected",

		"ChannelInitialized": "Channel initialized",
		"ChannelClosed": "Channel closed",

		"ChannelStart": "Channel start",
		"ChannelStarted": "Channel started",
		"ChannelStop": "Channel stop",
		"ChannelStopped": "Channel stopped",

		"ClientConnected": "Client Connected",
		"ClientDisconnected": "Client Disconnected",

		"MainLoop_Tick": "Main Loop",
		"MainLoop_Stop": "Main Loop Stop",

		"MessageReceived": "DataMSG",

		"DataChannelAdded": "DCH Added",
		"DataChannelRemoved": "DCH Removed"

	},

	"Messages": {
		"DataMessage": "DataMSG"
	}
};

/**
 * Data message
 *
 * @class
 * @memberof st.net
 * @property {string} type - Type of message
 * @property {string} typeExtra - Extra type property
 * @property {string} dataType - Data type
 * @property {object} msg - Message payload
 */

var DataMessage =

/**
 * @constructs DataMessage
 *
 * @param {object} msg - Message payload object
 */
function DataMessage(msg) {
	_classCallCheck(this, DataMessage);

	/**
  * @param type Message type
  */
	this.type = DataChannel_CONSTANTS.Config.MSGType_Normal;
	this.typeExtra = null;
	this.dataType = DataChannel_CONSTANTS.Config.DataType_JSON;
	this.msg = msg;

	this.CONSTANTS = DataChannel_CONSTANTS;
};

/**
 * Data channel
 * 
 * @class
 * @memberof st.net
 * @property {DataMessage[]} messagesList - Messages list
 * @property {EventEmitter} eventEmitter - Object for emit events
 * @property {object} server - Server object
 * @property {object} socket - Socket object
 * @property {object} _mainLoop - Mainloop reference
 * @property {object} config - Configuration object
 */


var DataChannel = function () {

	/**
  * 
  * @constructs DataChannel
  * @param {object} config - Configuration object
  */

	function DataChannel(config) {
		_classCallCheck(this, DataChannel);

		this.messagesList = [];
		this.eventEmitter = new EventEmitter();

		this.CONSTANTS = DataChannel_CONSTANTS;

		this.server = null;
		this.socket = null;

		this._mainLoop = null;

		this.config = config;

		this.state = DataChannel_CONSTANTS.States.DCstate_Config;

		var dc = this;

		// Map event MainLoop_Stop
		dc.eventEmitter.on(dc.CONSTANTS.Events.MainLoop_Stop, function () {
			clearInterval(dc._mainLoop);
			dc.state = dc.CONSTANTS.States.DCstate_Ready;
			dc.eventEmitter.emit(dc.CONSTANTS.Events.ChannelStopped);
		});
	}

	/**
  * Initialize data channel
  */


	_createClass(DataChannel, [{
		key: "initDataChannel",
		value: function initDataChannel() {

			var dc = this;

			if (dc.state !== dc.CONSTANTS.States.DCstate_Config) {
				throw "Bad channel state";
			}
		}

		/**
   * Close data channel
   */

	}, {
		key: "closeDataChannel",
		value: function closeDataChannel() {

			var dc = this;

			if (dc.state !== dc.CONSTANTS.States.DCstate_Ready) {
				throw "Bad channel state";
			}
		}

		/**
   * Start data channel
   */

	}, {
		key: "startDataChannel",
		value: function startDataChannel() {

			var dc = this;

			if (dc.state !== dc.CONSTANTS.States.DCstate_Ready) {
				throw "Bad channel state";
			}
		}

		/**
   * Stop data channel
   */

	}, {
		key: "stopDataChannel",
		value: function stopDataChannel() {

			var dc = this;

			if (dc.state !== dc.CONSTANTS.States.DCstate_Working) {
				throw "Bad channel state";
			}
		}

		/**
   * Send message
   *
   * @param {object} msg - Message payload
   */

	}, {
		key: "sendMessage",
		value: function sendMessage(msg) {

			var dc = this;

			var dataMSG = new DataMessage(msg);
			dc.messagesList.push(dataMSG);
		}

		/**
   * Main loop
   */

	}, {
		key: "mainLoop",
		value: function mainLoop() {

			var dc = this;

			if (dc.state !== dc.CONSTANTS.States.DCstate_Ready) {
				throw "Bad channel state";
			}

			dc.state = dc.CONSTANTS.States.DCstate_Working;

			dc._mainLoop = setInterval(function () {
				if (dc.state === dc.CONSTANTS.States.DCstate_Working) {

					// Emit event MainLoop_Tick
					dc.eventEmitter.emit(dc.CONSTANTS.Events.MainLoop_Tick);
				} else {

					// Emit event MainLoop_Stop
					dc.eventEmitter.emit(dc.CONSTANTS.Events.MainLoop_Stop);
				}
			}, dc.config.loopTime);
		}

		/**
   * Stop main loop
   */

	}, {
		key: "stopMainLoop",
		value: function stopMainLoop() {

			var dc = this;

			dc.eventEmitter.emit(dc.CONSTANTS.Events.MainLoop_Stop); // Emit event MainLoop_Stop
		}
	}]);

	return DataChannel;
}();

/**
 * The SearchResult_ByTypeExtra result object.
 * 
 * @typedef {Object} SearchResult_ByTypeExtra
 * @memberof st.net.DataChannelsManager
 * @type Object
 * @property {(st.net.DataMessage[]|null)} messages - The messages list, may be null.
 * @property {number} numMessages - Number of messages.
 * 
 */

/**
 * The SearchResult_ByTypeExtra result object.
 * 
 * @typedef {Object} SearchResult_ByID
 * @memberof st.net.DataChannelsManager
 * @type Object
 * @property {(st.net.DataChannel|null)} dataChannel - The Data channel, may be null.
 * @property {number} position - Position in list.
 * 
 */

/**
 * Data channels manager
 *
 * @class
 * @memberof st.net
 * @property {st.net.DataChannel[]} channelsList - Channels list
 */


var DataChannelsManager = function () {

	/**
  *
  * @constructs DataChannelsManager
  */

	function DataChannelsManager() {
		_classCallCheck(this, DataChannelsManager);

		this.channelsList = [];
		this.eventEmitter = new EventEmitter();

		this.CONSTANTS = DataChannel_CONSTANTS;
	}

	/**
  * Get Data channel
  *
  * @param {object} config - Configuration object
  * @returns {st.net.DataChannel}
  */


	_createClass(DataChannelsManager, [{
		key: "addDataChannel",


		/**
   * Add data channel
   * 
   * @param {st.net.DataChannel} dch - Data channel object
   */
		value: function addDataChannel(dch) {

			var dcm = this;

			if (dch.config.id === undefined || dch.config.id === null) {
				throw "Channel needs ID.";
			}

			var dchSearch = dcm.getDataChannelByID(dch.config.id);
			if (dchSearch.dataChannel !== null) {
				throw "Duplicated channel ID.";
			}

			dcm.channelsList.push(dch);

			dcm.eventEmitter.emit(dcm.CONSTANTS.Events.DataChannelAdded, dch.config.id); // Emit event DataChannelAdded
		}

		/**
   * Remove data channel
   * 
   * @param {string} dchID - Data channel ID
   */

	}, {
		key: "removeDataChannel",
		value: function removeDataChannel(dchID) {

			var dcm = this;

			var dchSearch = dcm.getDataChannelByID(dchID);
			if (dchSearch.dataChannel === null) {
				throw "Channel not found.";
			}

			var dataChannel = dchSearch.dataChannel;

			if (dataChannel.state !== dataChannel.CONSTANTS.States.DCstate_Config) {
				throw "Bad channel state.";
			}

			dcm.channelsList.splice(dchSearch.position, 1);

			// Emit event DataChannelRemoved
			dcm.eventEmitter.emit(dcm.CONSTANTS.Events.DataChannelRemoved, dchID);
		}

		/**
   * Returns data channel searched by id
   * 
   * @param {string} dchID - Data channel ID
   * @returns {st.net.DataChannelsManager.SearchResult_ByID}
   */

	}, {
		key: "getDataChannelByID",
		value: function getDataChannelByID(dchID) {

			var dcm = this;
			var dch = null;

			var _i = 0;

			_i = dcm.channelsList.map(function (x) {
				return x.config.id;
			}).indexOf(dchID);

			if (_i !== -1) {
				dch = dcm.channelsList[_i];
			}

			return {
				"dataChannel": dch,
				"position": _i
			};
		}
	}], [{
		key: "get_DataChannel",
		value: function get_DataChannel(config) {

			var dataChannel = null;

			switch (config.type) {

				case DataChannel_CONSTANTS.Config.DCtype_socketio:
					var DC_SocketIO = require('./DC_SocketIO.js');
					dataChannel = new DC_SocketIO(config);
					break;

				default:
					break;
			}

			return dataChannel;
		}

		/**
   * Returns Messages searched by Message.typeExtra
   * 
   * @param {string} typeExtra - Type extra
   * @param {st.net.DataMessage[]} msgList - Message list
   * @returns {st.net.DataChannelsManager.SearchResult_ByTypeExtra}
   */

	}, {
		key: "getMessagesByTypeExtra",
		value: function getMessagesByTypeExtra(typeExtra, msgList) {

			var messages = msgList.filter(function (msg, _i, _items) {

				if (msg.typeExtra === typeExtra) {
					return true;
				}
			});

			return {
				"numMessages": messages.length,
				"messages": messages
			};
		}
	}]);

	return DataChannelsManager;
}();

var dataChannel_Lib = {
	"CONSTANTS": DataChannel_CONSTANTS,
	"DataChannel": DataChannel,
	"DataMessage": DataMessage,
	"DataChannelsManager": DataChannelsManager
};

module.exports = dataChannel_Lib;
//# sourceMappingURL=DataChannel.js.map
