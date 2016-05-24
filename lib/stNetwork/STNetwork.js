"use strict";

/**
 * SomeThings Network library
 * 
 * 
 */

let dataChannel_Lib = require("./DataChannel.js");
let DC_SocketIO_Lib = require("./DC_SocketIO.js");
let SCS_RouteNet = require("./scs_routes/SCS_RouteNet.js");
let COMSystem_Lib = require("./COMSystem.js");

let services = require('./services/stNETservices');


let stNetwork_Lib = {
		
	"DataMessage" : dataChannel_Lib.DataMessage,
	"DataChannel" : dataChannel_Lib.DataChannel,

	
	"DataChannelsManager" : dataChannel_Lib.DataChannelsManager,
	"DC_SocketIO" : DC_SocketIO_Lib.DC_SocketIO,

	"SCS_RouteNet" : SCS_RouteNet,
	
	"COMSystem" : COMSystem_Lib.COMSystem,
	
	"Services" : services
		
};

module.exports = stNetwork_Lib;