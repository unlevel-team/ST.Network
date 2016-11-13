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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var express = require('express');

/**
 * Import SCS_RouteNetNodes
 * @ignore
 */
var SCS_RouteNetNodes = require("./SCS_RouteNetNodes.js");

/**
 * Import SCS_RouteNetServer
 * @ignore
 */
var SCS_RouteNetServer = require("./SCS_RouteNetServer.js");

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

var SCS_RouteNet = function () {

	/**
  * 
  * @constructs SCS_RouteNet
  * 
  * @param {NodesManager} nodesManager - Nodes manager
  * @param {st.net.services.NodesNetManager} nodesNetManager - Nodes Net manager
  * @param {st.net.services.ServerNetManager} serverNetManager - Server Net manager
  * 
  */

	function SCS_RouteNet(nodesManager, nodesNetManager, serverNetManager) {
		_classCallCheck(this, SCS_RouteNet);

		var _routerNet = this;

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


	_createClass(SCS_RouteNet, [{
		key: "initialize",
		value: function initialize() {

			var _routerNet = this;

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

	}, {
		key: "mapServiceRoutes",
		value: function mapServiceRoutes() {

			var _routerNet = this;

			if (_routerNet.expressRoute === null) {
				throw "Not initialized";
			}

			_routerNet.expressRoute.use('/Nodes', _routerNet.routesforNodes.expressRoute);
			_routerNet.expressRoute.use('/Server', _routerNet.routesforServer.expressRoute);
		}
	}]);

	return SCS_RouteNet;
}();

module.exports = SCS_RouteNet;
//# sourceMappingURL=SCS_RouteNet.js.map
