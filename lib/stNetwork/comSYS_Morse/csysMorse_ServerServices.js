"use strict";

/**
 * COMSystem library
 * for role Server
 * 
 * Provides communications system to ST network
 * 
 * 
 * v. Morse
 */


/**
 * import TBind_Morse_Server
 * @ignore
 */
let TBind_Morse_Server = require('./csysMorse_Server.js').TBind_Morse_Server;

/**
 * import TBind_Morse_Service
 * @ignore
 */
let TBind_Morse_Service = require('./csysMorse_Services.js').TBind_Morse_Service;

/**
 * import COMSys_Morse_Service
 * @ignore
 */
let COMSys_Morse_Service = require('./csysMorse_Services.js').COMSys_Morse_Service;




/**
 * Bind Service
 * <pre>
 * Role Server
 * </pre>
 * 
 * 
 * @class
 * @memberof st.net.comsys_morse
 * @implements st.net.comsys_morse.TBind_Morse_Service
 * 
 */
class TBind_Morse_Srv_Server extends TBind_Morse_Service {
	
	/**
	 * @constructs TBind_Morse_Srv_Server
	 * 
	 * @param {COMSystem} comSYS, 
	 */
	constructor(comSYS, tBind) {
		
		super(comSYS, tBind);
	}
	
	
	/**
	 * Event Unbind
	 */
	_event_Unbind(data) {
		
		let _service = this;
		let _tBind = _service.tBind;
		
		let _comSYS = _service.comSYS;
		let _config = _comSYS.config;
		
		let socket = _config.controlChannel.socket;
		
		let synchro = data.synchro;
		let options = data.options;
		
		if (synchro) {
			
			// Send Message UnBind
			socket.emit(_comSYS.CONSTANTS.Messages.UnBind, 
				{
					"bindID" : options.bindID
				}
			);
		}
		
	}
	
	
}



/**
 * Communications System Service
 * <pre>
 * Role Server
 * </pre>
 * 
 * @class
 * @memberof st.net.comsys_morse
 * @implements st.net.comsys_morse.COMSys_Morse_Service
 */
class COMSys_Morse_Srv_Server extends COMSys_Morse_Service {
	
	/**
	 * 
	 * @constructs COMSys_Morse_Srv_Server
	 */
	constructor(comSYS) {
		
		super(comSYS);
	}
	
	
	/**
	 * Map control messages
	 */
	mapControlMessages(socket) {
		
		super.mapControlMessages(socket);
		
		let service = this;
		
		let comSYS = service.comSYS;
		let _config = comSYS.config;
		
		if (socket === undefined) {
			socket = _config.controlChannel.socket;
		}

		
		// Map message Bind_Created
		socket.on(comSYS.CONSTANTS.Messages.Bind_Created, function(msg){
			service._msg_Bind_Created(msg, socket, {
				"bindID" : msg.bindID,
				"type" : msg.type,
				"source" :  msg.source,
				"target" :  msg.target
				
			});
		});
		
		
	}
	
	
	/**
	 * Event Bind_Added
	 */
	_event_Bind_Added(data) {
		
		let service = this;
		
		let comSYS = service.comSYS;
		let _config = comSYS.config;
		
		let socket = _config.controlChannel.socket;
		
		let synchro = data.synchro;
		let bind = data.bind;
		let options = data.options;
		
		if (synchro) {
			
			// Send Message createBind
			socket.emit(comSYS.CONSTANTS.Messages.createBind, 
				{
					"bindID" : options.bindID,
					"type" : options.type,
					"source" : options.source,
					"target" : options.target
				}
			);
		}
		
	}
	
	
	/**
	 * Message Bind_Created
	 */
	_msg_Bind_Created(msg, socket, options) {
		
		let service = this;
		
		let comSYS = service.comSYS;
		let _config = comSYS.config;
		
		let type = options.type;
		let source = options.source;
		let target = options.target;
		let _options = {
			"bindID" : options.bindID
		};

		let bindID = options.bindID;
		
		console.log('<*> ST COMSys_Morse_Service._msg_Bind_Created');	// TODO REMOVE DEBUG LOG

		
		try {
			
			let tbindSearch = comSYS.getBindByID(bindID);
			if (tbindSearch.tbind === null) {
				throw "Bind not found.";
			}
			
			let tbind = tbindSearch.tbind;
			
//			tbind.initialize();
//			comSYS.addBind(tbind);
		} catch (e) {
			
			console.log('<EEE> ST COMSys_Morse_Service._msg_createBind');	// TODO REMOVE DEBUG LOG
			console.log(e);	// TODO REMOVE DEBUG LOG
			
			// Notify Error
			service.sendErrorInfo( socket, "Net.Bind", e, 
				{ 
					"controlMSG": comSYS.CONSTANTS.Messages.Bind_Created, 
					"msg": msg, 
					"options": options 
				}
			);
			
		}
		
	} 
	
}




let cysMorseSrv_Server_Lib = {
		"TBind_Morse_Srv_Server" : TBind_Morse_Srv_Server,
		"COMSys_Morse_Srv_Server" : COMSys_Morse_Srv_Server
	};


module.exports = cysMorseSrv_Server_Lib;
	
