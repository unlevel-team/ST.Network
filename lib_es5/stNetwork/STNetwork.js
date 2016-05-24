"use strict";

/**
 * SomeThings Network library
 * 
 * 
 */

var dataChannel_Lib = require("./DataChannel.js");
var DC_SocketIO_Lib = require("./DC_SocketIO.js");
var SCS_RouteNet = require("./scs_routes/SCS_RouteNet.js");
var COMSystem_Lib = require("./COMSystem.js");

var services = require('./services/stNETservices');

var stNetwork_Lib = {

	"DataMessage": dataChannel_Lib.DataMessage,
	"DataChannel": dataChannel_Lib.DataChannel,

	"DataChannelsManager": dataChannel_Lib.DataChannelsManager,
	"DC_SocketIO": DC_SocketIO_Lib.DC_SocketIO,

	"SCS_RouteNet": SCS_RouteNet,

	"COMSystem": COMSystem_Lib.COMSystem,

	"Services": services

};

module.exports = stNetwork_Lib;
//# sourceMappingURL=STNetwork.js.map
