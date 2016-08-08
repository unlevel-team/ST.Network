"use strict";

/**
 * import express
 * @ignore
 */
let express = require('express');

/**
 * import bodyParser
 * @ignore
 */
let bodyParser = require('body-parser');


/**
 * Routes for Net of Nodes
 * <pre>
 * Use with Server control service
 * </pre>
 * 
 * @class
 * @memberof st.net.comsys_morse.scs_routes
 * 
 * @property {object} expressRoute - Express route object
 * @property {number} messages - Counter for messages
 * 
 * @property {NodesManager} nodesManager - Nodes manager
 * @property {st.net.NodesNetManager} nodesNetManager - Nodes Net manager
 * 
 */
class SCS_RouteNetNodes {
	
	/**
	 * 
	 * @constructs SCS_RouteNetNodes
	 * 
	 * @param {NodesManager} nodesManager - Nodes manager
	 * @param {st.net.services.NodesNetManager} nodesNetManager - Nodes Net manager
	 * @param {object} expressRoute - Express route object
	 * 
	 */
	constructor(nodesManager, nodesNetManager, expressRoute) {
		
		this.expressRoute = expressRoute;
		this.messages = 0;
		
		this.nodesManager = nodesManager;
		this.nodesNetManager = nodesNetManager;
		
		this.mapServiceRoutes();
	}
	
	
	/**
	 * Get data channel of node
	 */
	_getDCofNode(nodeID, channelID, routerNet) {
		
		if (routerNet === undefined) {
			routerNet = this;
		}
		
		let ndm = routerNet.nodesManager;
		let nnetm = routerNet.nodesNetManager;
		
		
		let nodeSearch = ndm.getNodeByID(nodeID);
		if (nodeSearch.stNode === null) {
			throw "Node not found.";
		}
		
		let stNode = nodeSearch.stNode;
		
		
		let dchSearch = nnetm.getDataChannelOfNode(nodeID, channelID);
		if (dchSearch.dataChannel === null) {
			throw "Data channel not found.";
		}
		
		let dch = dchSearch.dataChannel;
		
		
		let response = {
			"node": stNode,
			"dataChannel": dch
		};
		
		return response;
	}
	
	
	/**
	 * Map service routes
	 */
	mapServiceRoutes() {
		
		let routerNet = this;
		
		if (routerNet.expressRoute === undefined || 
				routerNet.expressRoute === null) {
			routerNet.expressRoute = express.Router();
		}
		
		
		//create application/json parser 
		let jsonParser = bodyParser.json();

		// middleware that is specific to this router
		routerNet.expressRoute.use(function messageCount(req, res, next) {
			
			routerNet.messages++;
			
//			res.setHeader('Content-Type', 'text/html');
//			res.write('ST Server Nodes <br />', 'utf8')
			
			res.setHeader('Content-Type', 'application/json');
			next();
			
		});
		
		
		// define the home page route
		routerNet.expressRoute.get('/', function(req, res) {
			
			routerNet._route_Default({
				'req': req,
				'res': res,
				'routerNet': routerNet
			});
			
		});
		
		
		// List of data channels
		routerNet.expressRoute.get('/list/', function(req, res) {
			
			routerNet._route_DC_list({
				'req': req,
				'res': res,
				'routerNet': routerNet
			});
			
		});
		
		
		// List of data channels for node
		routerNet.expressRoute.get('/:nodeID/list/', function(req, res) {
			
			routerNet._route_DC_listforNode({
				'req': req,
				'res': res,
				'routerNet': routerNet,
				'nodeID': req.params.nodeID
			});
			
		});
		
		
		// Create data channel on node
		routerNet.expressRoute.get('/:nodeID/create/:channelID/:mode', function(req, res) {
			
			routerNet._route_createDC_onNode({
				'req': req,
				'res': res,
				'routerNet': routerNet,
				'nodeID': req.params.nodeID,
				'channelID': req.params.channelID,
				'mode': req.params.mode
			});
			
		});
		
		
		// Delete data channel on node
		routerNet.expressRoute.get('/:nodeID/delete/:channelID/', function(req, res) {
			
			routerNet._route_deleteDC_onNode({
				'req': req,
				'res': res,
				'routerNet': routerNet,
				'nodeID': req.params.nodeID,
				'channelID': req.params.channelID
			});
			
		});

		
		// Get options of data channel on node
		routerNet.expressRoute.get('/:nodeID/options/:channelID/', function(req, res) {
			
			routerNet._route_getDCoptions({
				'req': req,
				'res': res,
				'routerNet': routerNet,
				'nodeID': req.params.nodeID,
				'channelID': req.params.channelID
			});
			
		});
		
		
		// Set options of data channel on node
		routerNet.expressRoute.post('/:nodeID/options/:channelID/', jsonParser, function(req, res) {
			
			routerNet._route_setDCoptions({
				'req': req,
				'res': res,
				'routerNet': routerNet,
				'nodeID': req.params.nodeID,
				'channelID': req.params.channelID,
				'options': req.body.options
			});
			
		});
		
		
		// Route for Initialize data channel on node
		routerNet.expressRoute.get('/:nodeID/control/:channelID/init', function(req, res) {
			
			routerNet._route_initDC(req, res, routerNet);
		});
		
		
		// Route for Close data channel on node
		routerNet.expressRoute.get('/:nodeID/control/:channelID/close', function(req, res) {
			
			routerNet._route_closeDC(req, res, routerNet);
		});
		
		
		// Route for Start data channel on node
		routerNet.expressRoute.get('/:nodeID/control/:channelID/start', function(req, res) {
			
			routerNet._route_startDC(req, res, routerNet);
		});
		
		
		// Route for Stop data channel on node
		routerNet.expressRoute.get('/:nodeID/control/:channelID/stop', function(req, res) {
			
			routerNet._route_stopDC(req, res, routerNet);
		});
	}
	
	
	
	/**
	 * Default response
	 */
	_route_Default(options) {
		
		let _req = options.req;
		let _res = options.res;
		
		let _routerNet = this;
		if (options.routerNet !== undefined) {
			_routerNet = options.routerNet;
		}

		let _response = {
			"context" : "ST Server Net of Nodes",
			"action" : "Default",
			"messagesReceived" : _routerNet.messages
			
		};
		
		_res.jsonp(_response);
		_res.end();
		
	}
	
	
	/**
	 * List of Data Channels
	 */
	_route_DC_list(options) {
		
		let _req = options.req;
		let _res = options.res;
		
		let _routerNet = this;
		if (options.routerNet !== undefined) {
			_routerNet = options.routerNet;
		}

		let _response = {
			"context" : "ST Server Net of Nodes",
			"action" : "List",
			"numberOfDataChannels": 0,
			"dataChannels" : []
		};
		
		
		_routerNet.nodesNetManager.channelsList.forEach(function(_dch, _i) {
			let _dchData = {
					"channelID" : _dch.config.id,
					"type": _dch.config.type,
					"mode": _dch.config.mode,
					"state": _dch.state
			};
			_response.dataChannels.push(_dchData);
		});
		
		_response.numberOfDataChannels = _routerNet.nodesNetManager.channelsList.length;
		
		
		_res.jsonp(_response);
		_res.end();
	}
	
	
	/**
	 * List of Data Channels for one node
	 */
	_route_DC_listforNode(options) {
		
		let _req = options.req;
		let _res = options.res;
		
		let _routerNet = this;
		if (options.routerNet !== undefined) {
			_routerNet = options.routerNet;
		}
		
		let _nodeID = options.nodeID;
		
		let _response = {
			"context" : "ST Server Net of Nodes",
			"action" : "List for node",
			"nodeID" : req.params.nodeID,
			"numberOfDataChannels": 0,
			"dataChannels" : []
		};
		
		
		let _dchSearch = _routerNet.nodesNetManager.getDataChannelsOfNode(_nodeID);
		
		_dchSearch.dataChannels.forEach(function(_dch, _i) {
			let _dchData = {
					"channelID" : _dch.config.id,
					"type": _dch.config.type,
					"mode": _dch.config.mode,
					"state": _dch.state
			};
			_response.dataChannels.push(_dchData);
		});
		
		_response.numberOfDataChannels = _dchSearch.dataChannels.length;
		
		_res.jsonp(_response);
		_res.end();
		
	}
	
	
	/**
	 * Create DC on Node
	 */
	_route_createDC_onNode(options) {
		
		let _req = options.req;
		let _res = options.res;
		
		let _routerNet = this;
		if (options.routerNet !== undefined) {
			_routerNet = options.routerNet;
		}
		
		let _nodeID = options.nodeID;
		let _channelID = options.channelID;
		let _mode = options.mode;
		
		
		let _response = {
			"context" : "ST Server Net of Nodes",
			"action" : "Create input data channel",
			"nodeID" : _nodeID,
			"channelID" : _channelID,
			"mode" : _mode
		};
		
		
		try {
			
			let _dchConfig = {
				"mode" : null
			};
			
			switch (_mode) {
				case "in":
					_dchConfig.mode = _routerNet.nodesNetManager.CONSTANTS.Config.modeIN;
					break;
	
				case "out":
					_dchConfig.mode = _routerNet.nodesNetManager.CONSTANTS.Config.modeOUT;
					break;	
					
				default:
					throw "Bad mode.";
//						break;
			}
			
			
			let _nodeSearch = _routerNet.nodesManager.getNodeByID(_nodeID);
			if (_nodeSearch.stNode === null) {
				throw "Node not found.";
			}
			
			try {
				_routerNet.nodesNetManager.addDataChannelToNode(_nodeSearch.stNode, _channelID, _dchConfig);

			} catch (e) {
				throw "Error adding channel. " + e;
			}
			
			
		} catch (e) {
			
			// TODO: handle exception
			
			_response.ERROR = e;
		}
		
		
		_res.jsonp(_response);
		_res.end();
		
	}
	
	
	/**
	 * Delete DC on Node
	 */
	_route_deleteDC_onNode(options) {
		
		let _req = options.req;
		let _res = options.res;
		
		let _routerNet = this;
		if (options.routerNet !== undefined) {
			_routerNet = options.routerNet;
		}
		
		let _nodeID = options.nodeID;
		let _channelID = options.channelID;
		
		
		let _ndm = _routerNet.nodesManager;
		let _nnetm = _routerNet.nodesNetManager;
		
		let _response = {
			"context" : "ST Server Net of Nodes",
			"action" : "Delete data channel",
			"nodeID" : _nodeID,
			"channelID" : _channelID
		};
		
		
		try {
			
			let _nodeSearch = _ndm.getNodeByID(_nodeID);
			if (_nodeSearch.stNode === null) {
				throw "Node not found.";
			}
			
			let _stNode = _nodeSearch.stNode;
			
			let _dchSearch = _nnetm.getDataChannelOfNode(_nodeID, _channelID);
			if (_dchSearch.dataChannel === null) {
				throw "Data channel not found.";
			}
			
			try {
				_nnetm._deleteDConNode(_channelID, _stNode);
			} catch (e) {
				// TODO: handle exception
				throw "Cannor delete DC on node. " + e;
			}
			
		} catch (e) {
			
			_response.ERROR = e;
		} 
		
		
		_res.jsonp(_response);
		_res.end();
		
	}
	
	
	/**
	 * Get data channel options
	 */
	_route_getDCoptions(options) {
		
		let _req = options.req;
		let _res = options.res;
		
		let _routerNet = this;
		if (options.routerNet !== undefined) {
			_routerNet = options.routerNet;
		}
		
		let _nodeID = options.nodeID;
		let _channelID = options.channelID;
		
		
		let _ndm = _routerNet.nodesManager;
		let _nnetm = _routerNet.nodesNetManager;
		
		let _response = {
				"context" : "ST Server Net of Nodes",
				"action" : "Get Options of data channel",
				"nodeID" : _nodeID,
				"channelID" : _channelID,
				"options" : {}
			};
		
		
		try {
			
			let _searchDC = _routerNet._getDCofNode(_nodeID, _channelID, _routerNet);
			let _dch = _searchDC.dataChannel;
			
			_response.options.type = _dch.config.type;
			_response.options.mode = _dch.config.mode;
			_response.options.state = _dch.config.state;
			_response.options.netstate = _dch.config._netState;
			_response.options.socketPort = _dch.config.socketPort;
			_response.options.netLocation = _dch.config.netLocation;

			
		} catch (e) {
			
			_response.ERROR = e;
		} 
		
		
		_res.jsonp(_response);
		_res.end();
	
	}	
	
	
	/**
	 * Set data channel options
	 */
	_route_setDCoptions(options) {
		
		let _req = options.req;
		let _res = options.res;
		
		let _routerNet = this;
		if (options.routerNet !== undefined) {
			_routerNet = options.routerNet;
		}
		
		let _nodeID = options.nodeID;
		let _channelID = options.channelID;
		let _options = options.options;
		
		
		let _ndm = _routerNet.nodesManager;
		let _nnetm = _routerNet.nodesNetManager;
		
		let _response = {
			"context" : "ST Server Net of Nodes",
			"action" : "Set Options of data channel",
			"nodeID" : _nodeID,
			"channelID" : _channelID,
			"options" : _options
		};
		
		
		try {
			
			let _searchDC = _routerNet._getDCofNode(_nodeID, _channelID, _routerNet);
			let _dch = _searchDC.dataChannel;
			
			_nnetm.setOptionsOfDataChannel(_dch, _options);
			
		} catch (e) {
			_response.ERROR = e;
		}
		
		
		_res.jsonp(_response);
		_res.end();

	}
	
	
	/**
	 * Initialize data channel on node
	 */
	_route_initDC(req, res, routerNet) {
		
		if (routerNet === undefined) {
			routerNet = this;
		}
		
		let ndm = routerNet.nodesManager;
		let nnetm = routerNet.nodesNetManager;
		
		let _response = {
				"context" : "ST Server Net of Nodes",
				"action" : "Initialize data channel",
				"nodeID" : req.params.nodeID,
				"channelID" : req.params.channelID
			};
		
		try {
			
			let searchDC = routerNet._getDCofNode(_response.nodeID, _response.channelID, routerNet);
			let dch = searchDC.dataChannel;
			let stNode = searchDC.node;
			
			try {
				
				dch.initDataChannel();
				
			} catch (e) {
				throw "Cannot init channel. " + e;
			}
			
			
		} catch (e) {
			_response.ERROR = e;
		}
		
		
		res.jsonp(_response);
		res.end();
		
	}
	
	
	/**
	 * Close data channel on node
	 */
	_route_closeDC(req, res, routerNet) {
		
		if (routerNet === undefined) {
			routerNet = this;
		}
		
		let ndm = routerNet.nodesManager;
		let nnetm = routerNet.nodesNetManager;
		
		let _response = {
				"context" : "ST Server Net of Nodes",
				"action" : "Close data channel",
				"nodeID" : req.params.nodeID,
				"channelID" : req.params.channelID
			};
		
		try {
			
			let searchDC = routerNet._getDCofNode(_response.nodeID, _response.channelID, routerNet);
			let dch = searchDC.dataChannel;
			let stNode = searchDC.node;
			
			try {
				
				dch.closeDataChannel();
				
			} catch (e) {
				throw "Cannot close channel. " + e;
			}
			
			
		} catch (e) {
			_response.ERROR = e;
		}
		
		
		res.jsonp(_response);
		res.end();
		
	}
	
	
	/**
	 * Start data channel on node
	 */
	_route_startDC(req, res, routerNet) {
		
		if (routerNet === undefined) {
			routerNet = this;
		}
		
		let ndm = routerNet.nodesManager;
		let nnetm = routerNet.nodesNetManager;
		
		let _response = {
				"context" : "ST Server Net of Nodes",
				"action" : "Start data channel",
				"nodeID" : req.params.nodeID,
				"channelID" : req.params.channelID
			};
		
		try {
			
			let searchDC = routerNet._getDCofNode(_response.nodeID, _response.channelID, routerNet);
			let dch = searchDC.dataChannel;
			let stNode = searchDC.node;
			
			try {
				
				dch.startDataChannel();
				
			} catch (e) {
				throw "Cannot start channel. " + e;
			}
			
			
		} catch (e) {
			_response.ERROR = e;
		}
		
		
		res.jsonp(_response);
		res.end();
		
	}
	
	
	/**
	 * Stop data channel on node
	 */
	_route_stopDC(req, res, routerNet) {
		
		if (routerNet === undefined) {
			routerNet = this;
		}
		
		let ndm = routerNet.nodesManager;
		let nnetm = routerNet.nodesNetManager;
		
		let _response = {
				"context" : "ST Server Net of Nodes",
				"action" : "Stop data channel",
				"nodeID" : req.params.nodeID,
				"channelID" : req.params.channelID
			};
		
		try {
			
			let searchDC = routerNet._getDCofNode(_response.nodeID, _response.channelID, routerNet);
			let dch = searchDC.dataChannel;
			let stNode = searchDC.node;
			
			try {
				
				dch.stopDataChannel();
				
			} catch (e) {
				throw "Cannot stop channel. " + e;
			}
			
			
		} catch (e) {
			_response.ERROR = e;
		}
		
		
		res.jsonp(_response);
		res.end();
		
	}
	
	
}


module.exports = SCS_RouteNetNodes;
