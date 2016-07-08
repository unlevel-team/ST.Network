"use strict";

/**
 SomeThings Network services library
*/




/**
 * @ignore
 */
function _get_NetServices() {
	let _lib = require('./NetServices.js');
	return _lib;
}


function _get_NodeNetManager() {
	let _lib = require('./NodeNetManager.js');
	return _lib;
}


function _get_NodeNetService() {
	let _lib = require('./NodeNetService.js').NodeNetService;
	return _lib;
}


function _get_NodesNetManager() {
	let _lib = require('./NodesNetManager.js');
	return _lib;
}


function _get_NodesNetService() {
	let NodesNetService = require('./NodesNetService.js').NodesNetService;
	return NodesNetService;
}


function _get_ServerNetManager() {
	let ServerNetManager = require('./ServerNetManager.js');
	return ServerNetManager;
}


/**
 * @namespace st.net.services
 * @memberof st.net
 */
let stNETservices_Lib = {
	
	"get_NetServices": _get_NetServices,
		
	"get_NodeNetManager": _get_NodeNetManager,
	"get_NodeNetService": _get_NodeNetService,
	
	"get_NodesNetManager" : _get_NodesNetManager,
	"get_NodesNetService" : _get_NodesNetService,
	"get_ServerNetManager" : _get_ServerNetManager
		
};


module.exports = stNETservices_Lib;