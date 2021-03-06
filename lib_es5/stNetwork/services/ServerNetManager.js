"use strict";

/*
 Server Net manager
 
 - Provides net management for server.
 - Add data channel to server
 - Remove data channel from server
 - Get data channels of server
 
 
 */

/**
 * import DataChannelsManager
 * @ignore
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataChannelsManager = require('../DataChannel.js').DataChannelsManager;

/**
 * Server net manager
 * 
 * @class
 * @memberof st.net.services
 * @implements st.net.DataChannelsManager
 * 
 * @property {object} config - Configuration object
 * 
 */

var ServerNetManager = function (_DataChannelsManager) {
	_inherits(ServerNetManager, _DataChannelsManager);

	/**
  * @constructs ServerNetManager
  * 
  * @param {object} config - Configuration object
  */

	function ServerNetManager(config) {
		_classCallCheck(this, ServerNetManager);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ServerNetManager).call(this));

		_this.config = config;

		return _this;
	}

	/**
  * Add data channel to server
  * 
  * @param {string} dchID - Data channel ID
  * @param {object} config - Configuration object for DC
  */


	_createClass(ServerNetManager, [{
		key: "addDataChannelToServer",
		value: function addDataChannelToServer(dchID, config) {

			var snetm = this;
			var server = snetm.config._server;

			var dch_Config = {
				id: dchID,
				type: snetm.CONSTANTS.Config.DCtype_socketio,
				_netState: snetm.CONSTANTS.Config.DCstate_Config
			};

			// ~ ~ ~ ^^^ ~ ~ ~  ^^^ ~ ~ ~  ^^^ ~ ~ ~ ^^^ ~ ~ ~  ^^^ ~ |\/|~~~
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
			// ~ ~ ~ ^^^ ~ ~ ~  ^^^ ~ ~ ~  ^^^ ~ ~ ~ ^^^ ~ ~ ~  ^^^ ~ |/\|~~~

			var dch = this.get_DataChannel(dch_Config);

			this.addDataChannel(dch);
		}
	}]);

	return ServerNetManager;
}(DataChannelsManager);

module.exports = ServerNetManager;
//# sourceMappingURL=ServerNetManager.js.map
