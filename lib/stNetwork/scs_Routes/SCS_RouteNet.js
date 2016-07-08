"use strict";

/**
 * Server Control System - Net routes
 * 
 * @namespace st.net.scs_routes
 * @memberof st.net
 * 
 * 
 */


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
 * <pre>
 * Use with Server control service
 * </pre>
 * 
 * @class
 * @memberof st.net.scs_routes
 * 
 * @property {NodesManager} nodesManager - Nodes manager
 * @property {st.net.services.NodesNetManager} nodesNetManager - Nodes Net manager
 * @property {object} expressRoute - Express route object
 * 
 * @property {st.net.scs_routes.SCS_RouteNetNodes} routesforNodes - Routes for Nodes
 * @property {st.net.scs_routes.SCS_RouteNetServer} routesforServer - Routes for Server
 * 
 */
class SCS_RouteNet {

	
	/**
	 * 
	 * @constructs SCS_RouteNet
	 * 
	 * @param {NodesManager} nodesManager - Nodes manager
	 * @param {st.net.services.NodesNetManager} nodesNetManager - Nodes Net manager
	 * 
	 */
	constructor(nodesManager, nodesNetManager, serverNetManager) {

		let routerNet = this;

		routerNet.expressRoute = null;
		routerNet.messages = 0;

		routerNet.nodesManager = nodesManager;
		routerNet.nodesNetManager = nodesNetManager;
		routerNet.serverNetManager = serverNetManager;

		routerNet.routesforNodes = null;
		routerNet.routesforServer = null;

		routerNet.initialize();
		routerNet.mapServiceRoutes();

	}

	
	/**
	 * Initialize
	 */
	initialize() {

		let routerNet = this;

		if (routerNet.expressRoute !== null) {
			throw "Already initialized";
		}

		routerNet.expressRoute = express.Router();

		routerNet.routesforNodes = new SCS_RouteNetNodes(routerNet.nodesManager, routerNet.nodesNetManager);
		routerNet.routesforServer = new SCS_RouteNetServer(routerNet.serverNetManager);

	}


	/**
	 * Map service routes
	 */
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
