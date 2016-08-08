"use strict";

/**
 * Server Control System - Net routes
 * 
 * @namespace st.net.comsys_morse.scs_routes
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
 * @memberof st.net.comsys_morse.scs_routes
 * 
 * @property {NodesManager} nodesManager - Nodes manager
 * @property {st.net.services.NodesNetManager} nodesNetManager - Nodes Net manager
 * @property {object} expressRoute - Express route object
 * 
 * @property {st.net.comsys_morse.scs_routes.SCS_RouteNetNodes} routesforNodes - Routes for Nodes
 * @property {st.net.comsys_morse.scs_routes.SCS_RouteNetServer} routesforServer - Routes for Server
 * 
 */
class SCS_RouteNet {

	
	/**
	 * 
	 * @constructs SCS_RouteNet
	 * 
	 * @param {NodesManager} nodesManager - Nodes manager
	 * @param {st.net.services.NodesNetManager} nodesNetManager - Nodes Net manager
	 * @param {st.net.services.ServerNetManager} serverNetManager - Server Net manager
	 * 
	 */
	constructor(nodesManager, nodesNetManager, serverNetManager) {

		let _routerNet = this;

		_routerNet.expressRoute = null;
		_routerNet.messages = 0;

		_routerNet.nodesManager = nodesManager;
		_routerNet.nodesNetManager = nodesNetManager;
		_routerNet.serverNetManager = serverNetManager;

		_routerNet.routesforNodes = null;
		_routerNet.routesforServer = null;

		_routerNet.initialize();
		_routerNet.mapServiceRoutes();
 
	}

	
	/**
	 * Initialize
	 */
	initialize() {

		let _routerNet = this;

		if (_routerNet.expressRoute !== null) {
			throw "Already initialized";
		}

		_routerNet.expressRoute = express.Router();

		_routerNet.routesforNodes = new SCS_RouteNetNodes(_routerNet.nodesManager, _routerNet.nodesNetManager);
		_routerNet.routesforServer = new SCS_RouteNetServer(_routerNet.serverNetManager);

	}


	/**
	 * Map service routes
	 * <pre>
	 * Nodes mapped to 'Nodes'
	 * Server mapped to 'Server'
	 * </pre>
	 */
	mapServiceRoutes() {

		let _routerNet = this;

		if (_routerNet.expressRoute === null) {
			throw "Not initialized";
		}

		_routerNet.expressRoute.use('/Nodes', _routerNet.routesforNodes.expressRoute);
		_routerNet.expressRoute.use('/Server', _routerNet.routesforServer.expressRoute);

	}

}


module.exports = SCS_RouteNet;
