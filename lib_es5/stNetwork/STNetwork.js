"use strict";

/**
 * SomeThings Network library
 * 
 * 
 */

var dataChannel_Lib = require("./DataChannel.js");
var DC_SocketIO_Lib = require("./DC_SocketIO.js");
var COMSystem_Lib = require("./COMSystem.js");

var stNetwork_Lib = {

	"DataMessage": dataChannel_Lib.DataMessage,
	"DataChannel": dataChannel_Lib.DataChannel,
	"DataChannelsManager": dataChannel_Lib.DataChannelsManager,

	"DC_SocketIO": DC_SocketIO_Lib.DC_SocketIO,
	"COMSystem": COMSystem_Lib.COMSystem

};

module.exports = stNetwork_Lib;
//# sourceMappingURL=STNetwork.js.map
