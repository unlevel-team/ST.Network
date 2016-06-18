"use strict";

/*
 SomeThings Network services library

*/

function _get_NodeNetManager() {
	var _lib = require('./NodeNetManager.js');
	return _lib;
}

function _get_NodeNetService() {
	var _lib = require('./NodeNetService.js').NodeNetService;
	return _lib;
}

function _get_NodesNetManager() {
	var _lib = require('./NodesNetManager.js');
	return _lib;
}

function _get_NodesNetService() {
	var NodesNetService = require('./NodesNetService.js').NodesNetService;
	return NodesNetService;
}

function _get_ServerNetManager() {
	var ServerNetManager = require('./ServerNetManager.js');
	return ServerNetManager;
}

var stNETservices_Lib = {

	"get_NodeNetManager": _get_NodeNetManager,
	"get_NodeNetService": _get_NodeNetService,

	"get_NodesNetManager": _get_NodesNetManager,
	"get_NodesNetService": _get_NodesNetService,
	"get_ServerNetManager": _get_ServerNetManager

};

module.exports = stNETservices_Lib;
//# sourceMappingURL=stNETservices_lib.js.map
