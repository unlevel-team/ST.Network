"use strict";

/*
 Node Net manager
 
 - Provides net management for node.
 - Add data channel to node
 - Remove data channel from node
 - Get data channels of node
 
 
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataChannelsManager = require('../DataChannel.js').DataChannelsManager;

/**
 * Node net manager
 */

var NodeNetManager = function (_DataChannelsManager) {
	_inherits(NodeNetManager, _DataChannelsManager);

	function NodeNetManager(config) {
		_classCallCheck(this, NodeNetManager);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NodeNetManager).call(this));

		_this.config = config;

		return _this;
	}

	/**
  * Add data channel to node
  * 
  * @dchID Data channel ID (DC.id)
  * @config DC configuration
  */


	_createClass(NodeNetManager, [{
		key: 'addDataChannelToNode',
		value: function addDataChannelToNode(dchID, config) {

			var nnetm = this;
			var node = nnetm.config._node;
			var nodeConfig = node.nodeConfiguration.config;

			var dch_Config = {
				id: dchID,
				type: nnetm.CONSTANTS.Config.DCtype_socketio,
				_nodeID: nodeConfig.node.nodeID,
				_node: node,
				_dchID: nodeConfig.node.nodeID + '.' + dchID,
				_netState: nnetm.CONSTANTS.States.DCstate_Config
			};

			// @ @ @ ^^^ @ @ @ ^^^ @ @ @ ^^^ @ @ @ ^^^ @ @ @ ^^^ @ @ @ ^^^ @ @ @ ^^^ |\/| ^^^
			// Extra config parameters
			if (config !== undefined && config !== null) {

				if (config.mode) {
					dch_Config.mode = config.mode;
				}

				if (config.socketPort) {
					dch_Config.socketPort = config.socketPort;
				}

				if (config.netLocation) {
					dch_Config.netLocation = config.netLocation;
				}
			}
			// @ @ @ ^^^ @ @ @ ^^^ @ @ @ ^^^ @ @ @ ^^^ @ @ @ ^^^ @ @ @ ^^^ @ @ @ ^^^ |/\| ^^^

			var dch = DataChannelsManager.get_DataChannel(dch_Config);

			nnetm._mapDCcontrolEvents(dch);

			nnetm.addDataChannel(dch);
		}

		/**
   * Remove data channel from node
   * 
   * @dc could be DC.id or DC object
   */

	}, {
		key: 'removeDataChannelFromNode',
		value: function removeDataChannelFromNode(dc) {

			var nnetm = this;

			var dataChannel = null;

			// check for DC.id or DC object
			if (dc.config !== undefined) {
				dataChannel = dc;
			} else {
				var dchSearch = nnetm.getDataChannelByID(dc);
				if (dchSearch.dataChannel === null) {
					throw "Channel not found.";
				}
				dataChannel = dchSearch.dataChannel;
			}

			var channelID = dataChannel.config.id;

			if (dataChannel.state !== dataChannel.CONSTANTS.States.DCstate_Config) {
				throw "Bad channel state.";
			}

			nnetm._unMapDCcontrolEvents(dataChannel);

			nnetm.removeDataChannel(channelID);
		}

		/**
   * Map control events for DC
   */

	}, {
		key: '_mapDCcontrolEvents',
		value: function _mapDCcontrolEvents(dch) {

			var nnetm = this;

			// Map event ChannelInitialized
			dch.eventEmitter.on(dch.CONSTANTS.Events.ChannelInitialized, function (data) {
				nnetm._event_ChannelInitialized(data, dch, nnetm);
			});

			// Map event ChannelStarted
			dch.eventEmitter.on(dch.CONSTANTS.Events.ChannelStarted, function (data) {
				nnetm._event_ChannelStarted(data, dch, nnetm);
			});

			// Map event ChannelStopped
			dch.eventEmitter.on(dch.CONSTANTS.Events.ChannelStopped, function (data) {
				nnetm._event_ChannelStopped(data, dch, nnetm);
			});

			// Map event ChannelClosed
			dch.eventEmitter.on(dch.CONSTANTS.Events.ChannelClosed, function (data) {
				nnetm._event_ChannelClosed(data, dch, nnetm);
			});
		}

		/**
   * UnMap control events for DC
   */

	}, {
		key: '_unMapDCcontrolEvents',
		value: function _unMapDCcontrolEvents(dch) {

			var nnetm = this;

			dch.eventEmitter.removeAllListeners(dch.CONSTANTS.Events.ChannelInitialized);
			dch.eventEmitter.removeAllListeners(dch.CONSTANTS.Events.ChannelStarted);
			dch.eventEmitter.removeAllListeners(dch.CONSTANTS.Events.ChannelStopped);
			dch.eventEmitter.removeAllListeners(dch.CONSTANTS.Events.ChannelClosed);
		}

		/**
   * Set data channel options
   */

	}, {
		key: 'setDCOptions',
		value: function setDCOptions(dch, options) {

			var nnetm = this;

			if (dch.state !== dch.CONSTANTS.States.DCstate_Config) {
				throw "Bad data channel state";
			}

			if (options.loopTime) {
				dch.config.loopTime = options.loopTime;
			}

			if (options.netLocation) {
				dch.config.netLocation = options.netLocation;
			}

			if (options.socketPort) {
				dch.config.socketPort = options.socketPort;
			}
		}

		/**
   * Event ChannelInitialized
   */

	}, {
		key: '_event_ChannelInitialized',
		value: function _event_ChannelInitialized(data, dch, nnetm) {

			if (nnetm === undefined) {
				nnetm = this;
			}

			// Emit event ChannelInitialized
			nnetm.eventEmitter.emit(nnetm.CONSTANTS.Events.ChannelInitialized, {
				"channelID": dch.config.id,
				"dataChannel": dch
			});
		}

		/**
   * Event ChannelStarted
   */

	}, {
		key: '_event_ChannelStarted',
		value: function _event_ChannelStarted(data, dch, nnetm) {

			if (nnetm === undefined) {
				nnetm = this;
			}

			// Emit event ChannelInitialized
			nnetm.eventEmitter.emit(nnetm.CONSTANTS.Events.ChannelStarted, {
				"channelID": dch.config.id,
				"dataChannel": dch
			});
		}

		/**
   * Event ChannelStopped
   */

	}, {
		key: '_event_ChannelStopped',
		value: function _event_ChannelStopped(data, dch, nnetm) {

			if (nnetm === undefined) {
				nnetm = this;
			}

			// Emit event ChannelInitialized
			nnetm.eventEmitter.emit(nnetm.CONSTANTS.Events.ChannelStopped, {
				"channelID": dch.config.id,
				"dataChannel": dch
			});
		}

		/**
   * Event ChannelClosed
   */

	}, {
		key: '_event_ChannelClosed',
		value: function _event_ChannelClosed(data, dch, nnetm) {

			if (nnetm === undefined) {
				nnetm = this;
			}

			// Emit event ChannelClosed
			nnetm.eventEmitter.emit(nnetm.CONSTANTS.Events.ChannelClosed, {
				"channelID": dch.config.id,
				"dataChannel": dch
			});
		}
	}]);

	return NodeNetManager;
}(DataChannelsManager);

module.exports = NodeNetManager;
//# sourceMappingURL=NodeNetManager.js.map
