"use strict";

/*
 SomeThings Network services library

*/

let NodeNetManager = require('./NodeNetManager.js');
let NodeNetService = require('./NodeNetService.js').NodeNetService;

let NodesNetManager = require('./NodesNetManager.js');
let NodesNetService = require('./NodesNetService.js').NodesNetService;
let ServerNetManager = require('./ServerNetManager.js');





let stNETservices_Lib = {
		
	"NodeNetManager": NodeNetManager,
	"NodeNetService": NodeNetService,
	
	"NodesNetManager" : NodesNetManager,
	"NodesNetService" : NodesNetService,
	"ServerNetManager" : ServerNetManager
		
};


module.exports = stNETservices_Lib;