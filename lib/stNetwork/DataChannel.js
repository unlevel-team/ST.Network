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
let EventEmitter = require('events').EventEmitter;


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
const DataChannel_CONSTANTS = {
		"Config" : {
			"DCtype_socketio" : "socketio",
			"DCtype_udp" : "udp",

			"MSGType_Normal" : "normal",
			"DataType_JSON" : "json",


			"modeIN" : "input",
			"modeOUT" : "output"

		},

		"States" : {
			"DCstate_Config" : "config",
			"DCstate_Ready" : "ready",
			"DCstate_Working" : "working",
			"DCstate_Stop" : "stop"
		},

		"Events" : {
			"ChannelConnected" : "Channel connected",
			"ChannelDisconnected" : "Channel disconnected",


			"ChannelInitialized" : "Channel initialized",
			"ChannelClosed" : "Channel closed",

			"ChannelStart" : "Channel start",
			"ChannelStarted" : "Channel started",
			"ChannelStop" : "Channel stop",
			"ChannelStopped" : "Channel stopped",

			"ClientConnected" : "Client Connected",
			"ClientDisconnected" : "Client Disconnected",

			"MainLoop_Tick" : "Main Loop",
			"MainLoop_Stop" : "Main Loop Stop",

			"MessageReceived" : "DataMSG",

			"DataChannelAdded" : "DCH Added",
			"DataChannelRemoved" : "DCH Removed",


		},

		"Messages" : {
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
class DataMessage {

	/**
	 * @constructs DataMessage
	 *
	 * @param {object} msg - Message payload object
	 */
	constructor(msg) {

		/**
		 * @param type Message type
		 */
		this.type = DataChannel_CONSTANTS.Config.MSGType_Normal;
		this.typeExtra = null;
		this.dataType = DataChannel_CONSTANTS.Config.DataType_JSON;
		this.msg = msg;

		this.CONSTANTS = DataChannel_CONSTANTS;
	}

}


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
class DataChannel {

	/**
	 * 
	 * @constructs DataChannel
	 * @param {object} config - Configuration object
	 */
	constructor(config) {

		this.messagesList = [];
		this.eventEmitter = new EventEmitter();

		this.CONSTANTS = DataChannel_CONSTANTS;

		this.server = null;
		this.socket = null;

		this._mainLoop = null;

		this.config = config;

		this.state = DataChannel_CONSTANTS.States.DCstate_Config;


		let dc = this;

		// Map event MainLoop_Stop
		dc.eventEmitter.on( dc.CONSTANTS.Events.MainLoop_Stop, function() {
			clearInterval( dc._mainLoop );
			dc.state = dc.CONSTANTS.States.DCstate_Ready;
			dc.eventEmitter.emit(dc.CONSTANTS.Events.ChannelStopped);
		});
	}


	/**
	 * Initialize data channel
	 */
	initDataChannel() {

		let dc = this;

		if (dc.state !== dc.CONSTANTS.States.DCstate_Config) {
			throw "Bad channel state";
		}

	}


	/**
	 * Close data channel
	 */
	closeDataChannel() {

		let dc = this;

		if (dc.state !== dc.CONSTANTS.States.DCstate_Ready) {
			throw "Bad channel state";
		}
	}


	/**
	 * Start data channel
	 */
	startDataChannel() {

		let dc = this;

		if ( dc.state !== dc.CONSTANTS.States.DCstate_Ready ) {
			throw "Bad channel state";
		}


	}


	/**
	 * Stop data channel
	 */
	stopDataChannel() {

		let dc = this;

		if (dc.state !== dc.CONSTANTS.States.DCstate_Working) {
			throw "Bad channel state";
		}


	}


	/**
	 * Send message
	 *
	 * @param {object} msg - Message payload
	 */
	sendMessage(msg) {

		let dc = this;

		let dataMSG = new DataMessage(msg);
		dc.messagesList.push(dataMSG);
	}


	/**
	 * Main loop
	 */
	mainLoop() {

	  let dc = this;

	  if ( dc.state !== dc.CONSTANTS.States.DCstate_Ready ) {
		  throw "Bad channel state";
	  }

	  dc.state = dc.CONSTANTS.States.DCstate_Working;

	  dc._mainLoop = setInterval(() => {
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
	stopMainLoop() {

		let dc = this;

		dc.eventEmitter.emit(dc.CONSTANTS.Events.MainLoop_Stop);	// Emit event MainLoop_Stop
	}

}


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
class DataChannelsManager {


	/**
	 *
	 * @constructs DataChannelsManager
	 */
	constructor() {
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
	static get_DataChannel(config) {

		let dataChannel = null;

		switch (config.type) {

		case DataChannel_CONSTANTS.Config.DCtype_socketio:
			let DC_SocketIO = require('./DC_SocketIO.js');
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
	static getMessagesByTypeExtra(typeExtra, msgList) {

		var messages = msgList.filter(function(msg, _i, _items) {

			if (msg.typeExtra === typeExtra) {
				return true;
			}

		});

		return {
			"numMessages": messages.length,
			"messages": messages
		};

	}


	/**
	 * Add data channel
	 * 
	 * @param {st.net.DataChannel} dch - Data channel object
	 */
	addDataChannel(dch) {

		let dcm = this;

		if (dch.config.id === undefined ||
				dch.config.id === null) {
			throw "Channel needs ID.";
		}

		let dchSearch = dcm.getDataChannelByID(dch.config.id);
		if (dchSearch.dataChannel !== null){
			throw "Duplicated channel ID.";
		}

		dcm.channelsList.push(dch);

		dcm.eventEmitter.emit( dcm.CONSTANTS.Events.DataChannelAdded, dch.config.id);	// Emit event DataChannelAdded
	}


	/**
	 * Remove data channel
	 * 
	 * @param {string} dchID - Data channel ID
	 */
	removeDataChannel(dchID) {

		let dcm = this;

		let dchSearch = dcm.getDataChannelByID(dchID);
		if (dchSearch.dataChannel === null){
			throw "Channel not found.";
		}

		let dataChannel = dchSearch.dataChannel;

		if (dataChannel.state !== dataChannel.CONSTANTS.States.DCstate_Config) {
			throw "Bad channel state.";
		}

		dcm.channelsList.splice(dchSearch.position, 1);

		// Emit event DataChannelRemoved
		dcm.eventEmitter.emit( dcm.CONSTANTS.Events.DataChannelRemoved, dchID);

	}


	/**
	 * Returns data channel searched by id
	 * 
	 * @param {string} dchID - Data channel ID
	 * @returns {st.net.DataChannelsManager.SearchResult_ByID}
	 */
	getDataChannelByID(dchID) {

		let dcm = this;
		let dch = null;

		let _i = 0;

		_i = dcm.channelsList.map(function(x) {return x.config.id; }).indexOf(dchID);

		if (_i !== -1) {
			dch = dcm.channelsList[_i];
		}

		return {
			"dataChannel": dch,
			"position": _i
		};
	}

}


var dataChannel_Lib = {
	"CONSTANTS" : DataChannel_CONSTANTS,
	"DataChannel" : DataChannel,
	"DataMessage" : DataMessage,
	"DataChannelsManager": DataChannelsManager
};

module.exports = dataChannel_Lib;
