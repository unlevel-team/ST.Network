"use strict";

/**
 * COMSystem library
 * 
 * Provides communications system to ST network
 * 
 * 
 * v. Morse
 * 
 */

/**
 * Import TBind_Morse
 * @ignore
 */
let TBind_Morse = require("./COMsys_Morse.js").TBind_Morse;


/**
 * Bind Service
 * 
 * 
 * @class
 * @memberof st.net.comsys_morse
 * 
 * @property {object} comSYS - The COMSystem.
 * @property {object} tBind - The TBind.
 * 
 */
class TBind_Morse_Service {
	
	/**
	 * 
	 * @param {COMSystem} comSYS - COM System
	 * @param {object} tBind - TBinds service
	 * @constructs TBind_Morse_Service
	 */
	constructor(comSYS, tBind) {
		
		this.comSYS = comSYS;
		this.tBind = tBind;
		this.CONSTANTS = comSYS.CONSTANTS;
	}
	
	/**
	 * Initialize TBind_Morse_Service
	 */
	initialize() {
		
		let service = this;
		service.mapControlEvents();
	}
	
	
	/**
	 * Map control events
	 */
	mapControlEvents() {
		
		let service = this;
		let tBind = service.tBind;
		
		let comSYS = service.comSYS;
		let _config = comSYS.config;
		
		let socket = _config.controlChannel.socket;
		
		// Map event Unbind
		tBind.eventEmitter.on(tBind.CONSTANTS.Events.Unbind, service._event_Unbind);
		
		// Map event Bind_Started
		tBind.eventEmitter.on(tBind.CONSTANTS.Events.Bind_Started, service._event_Bind_Started);
	}
	
	
	/**
	 * Event Bind_Started
	 */
	_event_Bind_Started(data) {
		
		let service = this;
		let tBind = service.tBind;
		
		let comSYS = service.comSYS;
		let _config = comSYS.config;
		
		let socket = _config.controlChannel.socket;
		
		let synchro = data.synchro;
		let options = data.options;
		
	}
	
	
	/**
	 * Event Unbind
	 */
	_event_Unbind(data) {	
		
	}
	
}


/**
 * Communications System Service
 * 
 * @class
 * @memberof st.net.comsys_morse
 * 
 */
class COMSys_Morse_Service {
	
	/**
	 * @construct COMSys_Morse_Service
	 */
	constructor(comSYS) {
		
		this.comSYS = comSYS;
		this.CONSTANTS = comSYS.CONSTANTS;
	}
	
	/**
	 * Initialize
	 */
	initialize() {
		
		let service = this;
		service.mapControlEvents();
		service.mapControlMessages();
	}
	
	
	/**
	 * Map control events
	 */
	mapControlEvents(socket) {
		
		let service = this;
		
		let comSYS = service.comSYS;
		let _config = comSYS.config;
		
		
		if (socket === undefined) {
			socket = _config.controlChannel.socket;
		}
		
		// Map event Bind_Added
		comSYS.eventEmitter.on(comSYS.CONSTANTS.Events.Bind_Added, service._event_Bind_Added);
		
	}
	
	
	/**
	 * Map control messages
	 */
	mapControlMessages(socket) {
		
		let service = this;
		
		let comSYS = service.comSYS;
		let _config = comSYS.config;
		
		if (socket === undefined) {
			socket = _config.controlChannel.socket;
		}
		
		
		// Map message getBindList
		socket.on(comSYS.CONSTANTS.Messages.getBindList, function(msg){
			service._msg_getBindList(msg, socket, {
				"filter" : msg.filter
			});
		  });
		
		
		// Map message ErrorInfo
		socket.on(comSYS.CONSTANTS.Messages.ErrorInfo, function(msg){
			service._msg_ErrorInfo(msg, socket, {
				"msgError" : msg
			});
		  });
		
	}
	
	
	/**
	 * Send ErrorInfo message
	 */
	sendErrorInfo(socket, context, msg, data) {
		
		let service = this;
		
		let comSYS = service.comSYS;
		let _config = comSYS.config;
		
//		let socket = _config.controlChannel.socket;
		
			
		let message = {
			"context" : context,
			"msg": msg,
			"data": data
		};
		
		socket.emit(service.CONSTANTS.Messages.ErrorInfo, message);	// Emit message BindList
		
	}
	
	
	/**
	 * Event Bind_Added
	 */
	_event_Bind_Added(data) {
		
	}
	
	
	/**
	 * Message ErrorInfo
	 */
	_msg_ErrorInfo(msg, socket, options) {
		
		console.log('<*> ST COMSys_Morse_Service._msg_ErrorInfo');	// TODO REMOVE DEBUG LOG
		console.log(msg);
		
	}
	
	
	/**
	 * Message getBindList
	 */
	_msg_getBindList(msg, socket, options) {
		
		let service = this;
		
		let comSYS = service.comSYS;
		let _config = comSYS.config;
		
		console.log('<*> ST COMSys_Morse_Service._msg_getBindList');	// TODO REMOVE DEBUG LOG
		
		let message = {
			"bindsList": [],
			"binds" : comSYS.thingsBindings.length
		};
		
		comSYS.thingsBindings.forEach(function(_bind, _i) {
			
			let bindInfo = {
				"bindID" : 	_bind.bindID,
				"type" : _bind.type,
				"state" : _bind.state
			};
			
			message.bindsList.push(bindInfo);
		});
		
		socket.emit(service.CONSTANTS.Messages.BindList, message);	// Emit message BindList
		
	}
	
}



let cysMorseSrv_Lib = {
	"TBind_Morse_Service" : TBind_Morse_Service,
	"COMSys_Morse_Service" : COMSys_Morse_Service
};


module.exports = cysMorseSrv_Lib;

