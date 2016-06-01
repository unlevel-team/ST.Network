"use strict";

let express = require('express');

let bodyParser = require('body-parser');


/**
 * Routes for Net of Nodes
 * Use with Server control service
 */
class SCS_RouteNetNodes {
	
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
	_getDCofNode(nodeID,channelID, routerNet) {
		
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
			
			let _response = {
				"context" : "ST Server Net of Nodes",
				"action" : "Default",
				"messagesReceived" : routerNet.messages
				
			};
			res.jsonp(_response);
			res.end();
			
		});
		
		
		// List of data channels
		routerNet.expressRoute.get('/list/', function(req, res) {
			
			let _response = {
				"context" : "ST Server Net of Nodes",
				"action" : "List",
				"numberOfDataChannels": 0,
				"dataChannels" : []
			};
			
			
			routerNet.nodesNetManager.channelsList.forEach(function(dch, _i) {
				let dchData = {
						"channelID" : dch.config.id,
						"type": dch.config.type,
						"mode": dch.config.mode,
						"state": dch.state
				};
				_response.dataChannels.push(dchData);
			});
			
			_response.numberOfDataChannels = routerNet.nodesNetManager.channelsList.length;
			
			
			res.jsonp(_response);
			res.end();
			
		});
		
		
		// List of data channels for node
		routerNet.expressRoute.get('/:nodeID/list/', function(req, res) {
			
			let _response = {
				"context" : "ST Server Net of Nodes",
				"action" : "List for node",
				"nodeID" : req.params.nodeID,
				"numberOfDataChannels": 0,
				"dataChannels" : []
			};
			
			
			let dchSearch = routerNet.nodesNetManager.getDataChannelsOfNode(req.params.nodeID);
			
			dchSearch.dataChannels.forEach(function(dch, _i) {
				let dchData = {
						"channelID" : dch.config.id,
						"type": dch.config.type,
						"mode": dch.config.mode,
						"state": dch.state
				};
				_response.dataChannels.push(dchData);
			});
			
			_response.numberOfDataChannels = dchSearch.dataChannels.length;

			
			res.jsonp(_response);
			res.end();
			
		});
		
		
		// Create data channel on node
		routerNet.expressRoute.get('/:nodeID/create/:channelID/:mode', function(req, res) {
			
			let _response = {
				"context" : "ST Server Net of Nodes",
				"action" : "Create input data channel",
				"nodeID" : req.params.nodeID,
				"channelID" : req.params.channelID,
				"mode" : req.params.mode
			};
			
			
			try {
				
				var dchConfig = {
					"mode" : null
				};
				
				switch (_response.mode) {
					case "in":
						dchConfig.mode = routerNet.nodesNetManager.CONSTANTS.Config.modeIN;
						break;
		
					case "out":
						dchConfig.mode = routerNet.nodesNetManager.CONSTANTS.Config.modeOUT;
						break;	
						
					default:
						throw "Bad mode.";
//						break;
				}
				
				
				let nodeSearch = routerNet.nodesManager.getNodeByID(_response.nodeID);
				if (nodeSearch.stNode === null) {
					throw "Node not found.";
				}
				
				try {
					routerNet.nodesNetManager.addDataChannelToNode(nodeSearch.stNode, req.params.channelID, dchConfig);

				} catch (e) {
					throw "Error adding channel. " + e;
				}
				
				
			} catch (e) {
				
				// TODO: handle exception
				
				_response.ERROR = e;
			}
			
			
			res.jsonp(_response);
			res.end();
		});
		
		
		// Delete data channel on node
		routerNet.expressRoute.get('/:nodeID/delete/:channelID/', function(req, res) {
			
			let ndm = routerNet.nodesManager;
			let nnetm = routerNet.nodesNetManager;
			
			let _response = {
				"context" : "ST Server Net of Nodes",
				"action" : "Delete data channel",
				"nodeID" : req.params.nodeID,
				"channelID" : req.params.channelID
			};
			
			
			try {
				
				let nodeSearch = routerNet.nodesManager.getNodeByID(_response.nodeID);
				if (nodeSearch.stNode === null) {
					throw "Node not found.";
				}
				
				let stNode = nodeSearch.stNode;
				
				let dchSearch = routerNet.nodesNetManager.getDataChannelOfNode(_response.nodeID, _response.channelID);
				if (dchSearch.dataChannel === null) {
					throw "Data channel not found.";
				}
				
				
				
				try {
//					stNode.socket.emit(event);;
					nnetm._deleteDConNode(_response.channelID, stNode);
				} catch (e) {
					// TODO: handle exception
					throw "Cannor delete DC on node. " + e;
				}
				
			} catch (e) {
				
				_response.ERROR = e;
			} 
			
			
			res.jsonp(_response);
			res.end();
		});

		
		// Get options of data channel on node
		routerNet.expressRoute.get('/:nodeID/options/:channelID/', function(req, res) {
			
			let ndm = routerNet.nodesManager;
			let nnetm = routerNet.nodesNetManager;
			
			let _response = {
					"context" : "ST Server Net of Nodes",
					"action" : "Get Options of data channel",
					"nodeID" : req.params.nodeID,
					"channelID" : req.params.channelID,
					"options" : {}
				};
			
			
			try {
				
				let searchDC = routerNet._getDCofNode(_response.nodeID, _response.channelID, routerNet);
				let dch = searchDC.dataChannel;
				
				_response.options.type = dch.config.type;
				_response.options.mode = dch.config.mode;
				_response.options.state = dch.config.state;
				_response.options.netstate = dch.config._netState;
				_response.options.socketPort = dch.config.socketPort;
				_response.options.netLocation = dch.config.netLocation;

				
			} catch (e) {
				
				_response.ERROR = e;
			} 
			
			
			res.jsonp(_response);
			res.end();
			
		});
		
		
		// Set options of data channel on node
		routerNet.expressRoute.post('/:nodeID/options/:channelID/', jsonParser, function(req, res) {
			
			let ndm = routerNet.nodesManager;
			let nnetm = routerNet.nodesNetManager;
			
			let options = req.body.options;
			
			let _response = {
					"context" : "ST Server Net of Nodes",
					"action" : "Set Options of data channel",
					"nodeID" : req.params.nodeID,
					"channelID" : req.params.channelID,
					"options" : options
				};
			
			
			try {
				
				let searchDC = routerNet._getDCofNode(_response.nodeID, _response.channelID, routerNet);
				let dch = searchDC.dataChannel;
				
				nnetm.setOptionsOfDataChannel(dch, options);
				
			} catch (e) {
				_response.ERROR = e;
			}
			
			
			res.jsonp(_response);
			res.end();
			
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
