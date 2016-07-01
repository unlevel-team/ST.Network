"use strict";

/**
 * Import express
 * @ignore
 */
let express = require('express');


/**
 * Import SCS_RouteNetNodes
 * @ignore
 */
let SCS_RouteNetNodes = require("./SCS_RouteNetNodes.js");

/**
 * Import SCS_RouteNetServer
 * @ignore
 */
let SCS_RouteNetServer = require("./SCS_RouteNetServer.js");

/**
 * Routes for Net
 * Use with Server control service
 */
class SCS_RouteNet {

	constructor(nodesManager, nodesNetManager, serverNetManager) {

		let routerNet = this;

		routerNet.expressRoute = null;
		routerNet.messages = 0;

		routerNet.nodesManager = nodesManager;
		routerNet.nodesNetManager = nodesNetManager;
		routerNet.serverNetManager = serverNetManager;

		routerNet.routesforNodes = null;
		routerNet.routesforServer = null;

		routerNet.expressRoute = null;

		routerNet.initialize();
		routerNet.mapServiceRoutes();

	}


	initialize() {

		let routerNet = this;

		if (routerNet.expressRoute !== null) {
			throw "Already initialized";
		}

		routerNet.expressRoute = express.Router();

		routerNet.routesforNodes = new SCS_RouteNetNodes(routerNet.nodesManager, routerNet.nodesNetManager);
		routerNet.routesforServer = new SCS_RouteNetServer(routerNet.serverNetManager);

	}


	mapServiceRoutes() {

		let routerNet = this;

		if (routerNet.expressRoute === null) {
			throw "Not initialized";
		}

		routerNet.expressRoute.use('/Nodes', routerNet.routesforNodes.expressRoute);
		routerNet.expressRoute.use('/Server', routerNet.routesforServer.expressRoute);

	}

}


module.exports = SCS_RouteNet;
