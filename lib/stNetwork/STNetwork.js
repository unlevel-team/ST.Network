"use strict";

/**
 * SomeThings Network library
 * 
 * @ignore
 */


/**
 * Import dataChannel_Lib
 * @ignore
 */
let dataChannel_Lib = require("./DataChannel.js");



//let DC_SocketIO_Lib = require("./DC_SocketIO.js");
//let SCS_RouteNet = require("./scs_routes/SCS_RouteNet.js");
//let COMSystem_Lib = require("./COMSystem.js");
//let services = require('./services/stNETservices_lib.js');


function _get_DC_SocketIO_Lib() {
	let _lib = require("./DC_SocketIO.js");
	return _lib;
}


function _get_SCS_RouteNet() {
	let _lib = require("./scs_routes/SCS_RouteNet.js");
	return _lib;
}


function _get_COMSystem_Lib() {
	let _lib = require("./COMSystem.js");
	return _lib;
}


function _get_Services() {
	let _lib = require('./services/stNETservices_lib.js');
	return _lib;
}


let stNetwork_Lib = {
		
	"DataMessage" : dataChannel_Lib.DataMessage,
	"DataChannel" : dataChannel_Lib.DataChannel,
	"DataChannelsManager" : dataChannel_Lib.DataChannelsManager,
	
	"DC_SocketIO" : _get_DC_SocketIO_Lib,

	
	"get_SCS_RouteNet" : _get_SCS_RouteNet,
	
	"get_COMSystem_Lib" : _get_COMSystem_Lib,
	
	"get_Services" : _get_Services
		
};

module.exports = stNetwork_Lib;