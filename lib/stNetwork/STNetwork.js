"use strict";

/**
 * SomeThings Network library
 * 
 * 
 */

let dataChannel_Lib = require("./DataChannel.js");
let DC_SocketIO_Lib = require("./DC_SocketIO.js");
let COMSystem_Lib = require("./COMSystem.js");

let stNetwork_Lib = {
		
	"DataMessage" : dataChannel_Lib.DataMessage,
	"DataChannel" : dataChannel_Lib.DataChannel,
	"DataChannelsManager" : dataChannel_Lib.DataChannelsManager,
	
	"DC_SocketIO" : DC_SocketIO_Lib.DC_SocketIO,
	"COMSystem" : COMSystem_Lib.COMSystem
		
		
};

module.exports = stNetwork_Lib;