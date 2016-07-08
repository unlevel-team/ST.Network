"use strict";

/**
 * COMSystem library
 * <pre>
 * for role Node
 * 
 * Provides communications system to ST network
 * 
 * 
 * v. Morse
 * </pre>
 * 
 * @ignore
 */


/**
 * Import TBind_Morse_Node
 * @ignore
 */
let TBind_Morse_Node = require('./csysMorse_Node.js').CSYS_Morse_Node;

/**
 * Import TBind_Morse_Service
 * @ignore
 */
let TBind_Morse_Service = require('./csysMorse_Services.js').TBind_Morse_Service;

/**
 * Import COMSys_Morse_Service
 * @ignore
 */
let COMSys_Morse_Service = require('./csysMorse_Services.js').COMSys_Morse_Service;


/**
 * Bind Service
 * <pre>
 * Role Node
 * </pre>
 * 
 * @class
 * @memberof st.net.comsys_morse
 * @implements st.net.comsys_morse.TBind_Morse_Service
 */
class TBind_Morse_Srv_Node extends TBind_Morse_Service {
	
	/**
	 * @constructs TBind_Morse_Srv_Node
	 */
	constructor(comSYS, tBind) {
		
		super(comSYS, tBind);
	}
	
	
	/**
	 * Event Unbind
	 */
	_event_Unbind(data) {
		
		let service = this;
		let tBind = service.tBind;
		
		let comSYS = service.comSYS;
		let _config = comSYS.config;
		
		let socket = _config.controlChannel.socket;
		
		let synchro = data.synchro;
		let options = data.options;
		
		
		if (synchro) {
			
			// Send Message BindFree
			socket.emit(comSYS.CONSTANTS.Messages.BindFree, 
				{
					"bindID" : tBind.bindID,
					"type" : tBind.type
				}
			);
		}
		
	}
	
	
}



/**
 * Communications System Service
 * <pre>
 * Role Node
 * </pre>
 * 
 * @class
 * @memberof st.net.comsys_morse
 * @implements st.net.comsys_morse.COMSys_Morse_Service
 * 
 * 
 */
class COMSys_Morse_Srv_Node extends COMSys_Morse_Service {
	
	/**
	 * @construct COMSys_Morse_Srv_Node
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

		
		// Map message createBind
		socket.on(comSYS.CONSTANTS.Messages.createBind, function(msg){
			service._msg_createBind(msg, socket, {
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
			
			// Send Message Bind_Created
			socket.emit(comSYS.CONSTANTS.Messages.Bind_Created, 
				{
					"bindID" : bind.bindID,
					"type" : bind.type
				}
			);
		}
		
	}
	
	
	/**
	 * Message createBind
	 */
	_msg_createBind(msg, socket, options) {
		
		let service = this;
		
		let comSYS = service.comSYS;
		let _config = comSYS.config;
		
		let type = options.type;
		let source = options.source;
		let target = options.target;
		let _options = {
			"bindID" : options.bindID
		};

		console.log('<*> ST COMSys_Morse_Service._msg_createBind');	// TODO REMOVE DEBUG LOG

		let tbind = new TBind_Morse_Node(type, source, target, _options);
		
		try {
			tbind.initialize();
			comSYS.addBind(tbind);
		} catch (e) {
			console.log('<EEE> ST COMSys_Morse_Service._msg_createBind');	// TODO REMOVE DEBUG LOG
			console.log(e);	// TODO REMOVE DEBUG LOG
			
			// Notify Error
			service.sendErrorInfo( socket, "Net.Bind", e, 
				{ 
					"controlMSG": comSYS.CONSTANTS.Messages.createBind, 
					"msg": msg, 
					"options": options 
				}
			);
			
		}
		
	}
	
}




let cysMorseSrv_Node_Lib = {
		"TBind_Morse_Srv_Node" : TBind_Morse_Srv_Node,
		"COMSys_Morse_Srv_Node" : COMSys_Morse_Srv_Node
	};


module.exports = cysMorseSrv_Node_Lib;
	
	