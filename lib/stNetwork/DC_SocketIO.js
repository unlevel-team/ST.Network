"use strict";

/**
 * DC_SocketIO library
 * 
 * Provides data channel to ST network based on socket.io
 * 
 * 
 */

let EventEmitter = require('events').EventEmitter;
let DataChannel = require('./DataChannel.js').DataChannel;

let portscanner = require('portscanner');
let http = require('http');


/**
 * Data Channel for Socket.io type
 */
class DC_SocketIO extends DataChannel {
	
	constructor(config) {
		super(config);
	}
	
	/**
	 * Initialize data channel
	 */
	initDataChannel() {
		
		let dc = this;
		
		super.initDataChannel();
		
		if (dc.config.socketPort === undefined) {
			throw "Socket port not defined.";
		}
		
		if (dc.config.netLocation === undefined) {
			throw "Net location not defined.";
		}
		
		switch ( dc.config.mode ) {
			case dc.CONSTANTS.Config.modeIN:
				dc.initDC_modeIN();
				break;
			case dc.CONSTANTS.Config.modeOUT:
				dc.initDC_modeOUT();
				break;
			default:
				break;
		}
		
	}
	
	
	/**
	 * Initialize mode IN
	 */
	initDC_modeIN() {
		
		let dc = this;
		
		if (dc.server !== null) {
			 throw "Server is initialized";
		}
		

		dc.server = require('socket.io')();
		
		// Map connection of Socket
		dc.server.on('connection', function(socket){	
			
			dc.eventEmitter.emit( dc.CONSTANTS.Events.ClientConnected , {"socket" : socket} );	// Emit event ClientConnected
			  
			// Map disconnection of Socket
			socket.on('disconnect', function(){	
				dc.eventEmitter.emit( dc.CONSTANTS.Events.ClientDisconnected , {"socket" : socket} );	// Emit event ClientDisconnected

			});
			  
			// Map message of Socket
			socket.on( dc.CONSTANTS.Messages.DataMessage , function(msg){	
				dc.eventEmitter.emit( dc.CONSTANTS.Events.MessageReceived , msg );	// Emit event MessageReceived

			});
			  
		});
		

		// Map event MainLoop_Tick
		dc.eventEmitter.on( dc.CONSTANTS.Events.MainLoop_Tick, function() {	
			
			console.log('<*> ST DC_SocketIO.MainLoop_Tick');	// TODO REMOVE DEBUG LOG
			console.log(' <~> ChannelID: ' + dc.config.id);	// TODO REMOVE DEBUG LOG
			console.log(dc.messagesList);	// TODO REMOVE DEBUG LOG
			
			// Emit messages to socket
			if (dc.messagesList.length > 0) {
				dc.server.sockets.emit(dc.CONSTANTS.Messages.DataMessage , dc.messagesList);
				dc.messagesList = [];
			}

		});
		
		
		
		
		// Checks the status of a single port
		portscanner.checkPortStatus(
				dc.config.socketPort, 
				dc.config.netLocation, 
				function(error, status) {
		  // Status is 'open' if currently in use or 'closed' if available
		  // console.log(status)
			
		  switch (status) {
		  
			case 'closed':
				
				// Connect socket.IO to any IP...
				
				dc._server = http.createServer();
				dc._server.listen(
						dc.config.socketPort, 
						dc.config.netLocation);
				
				dc.server.listen( dc._server );
				
				break;

			default:
				
				dc.server = null;
				throw "Net location already busy.";
				
//				break;
			}
		  
		});
		
		
		
		// Change state to Ready
		dc.state = dc.CONSTANTS.States.DCstate_Ready;
		
		// Emit event Channel initialized
		dc.eventEmitter.emit( dc.CONSTANTS.Events.ChannelInitialized );
	}
	
	
	/**
	 * Initialize mode OUT
	 */
	initDC_modeOUT() {
		
		let dc = this;
		
		if (dc.socket !== null) {
			 throw "Socket is initialized";
		}
		
		
		dc._serverURL = 'http://' + dc.config.netLocation + ':' + dc.config.socketPort;

		
		
		// Map event MainLoop_Tick
		dc.eventEmitter.on( dc.CONSTANTS.Events.MainLoop_Tick, function() {	
			
			console.log('<*> ST DC_SocketIO.MainLoop_Tick');	// TODO REMOVE DEBUG LOG
			console.log(' <~> ChannelID: ' + dc.config.id);	// TODO REMOVE DEBUG LOG
			console.log(dc.messagesList);	// TODO REMOVE DEBUG LOG
			
			// Emit messages to socket
			if (dc.messagesList.length > 0) {
				dc.socket.emit(dc.CONSTANTS.Messages.DataMessage , dc.messagesList);
				dc.messagesList = [];
			}
			
		});
		
		
		dc.socket = require('socket.io-client')(dc._serverURL);	// connect to server
		
		
//		var socket = new io.Socket();
//		socket.connect('http://' + ipAddress + ':' + port);
			
		
		// Map event connect
		dc.socket.on('connect', function(){	
			dc.eventEmitter.emit( dc.CONSTANTS.Events.ChannelConnected );	// Emit event ChannelStarted
			  
		});

		// Map event disconnect
		dc.socket.on('disconnect', function(){	
			dc.eventEmitter.emit( dc.CONSTANTS.Events.ChannelDisconnected );	// Emit event ChannelStop

		});
		
		// Map message of Socket
		dc.socket.on( dc.CONSTANTS.Messages.DataMessage , function(msg){	
			dc.eventEmitter.emit( dc.CONSTANTS.Events.MessageReceived , msg );	// Emit event MessageReceived

		});
		

		
		// Change state to Ready
		dc.state = dc.CONSTANTS.States.DCstate_Ready;
		
		// Emit event Channel initialized
		dc.eventEmitter.emit( dc.CONSTANTS.Events.ChannelInitialized );

	}
	
	
	/**
	 * Close data channel
	 */
	closeDataChannel() {
		
		super.closeDataChannel();
		
		let dc = this;
		
		switch ( dc.config.mode ) {
		
			case dc.CONSTANTS.Config.modeIN:
				dc.server.close();
				dc.server = null;
				break;
				
			case dc.CONSTANTS.Config.modeOUT:
				dc.socket.close();
				dc.socket = null;
				break;
				
			default:
				break;
		}
		
		// Change state to Config
		dc.state = dc.CONSTANTS.States.DCstate_Config;
		
		// Emit event ChannelClosed
		dc.eventEmitter.emit( dc.CONSTANTS.Events.ChannelClosed );

		
	}
	
	
	/**
	 * Start data channel
	 */
	startDataChannel() {
		
		super.startDataChannel();
		
		let dc = this;
		
		dc.mainLoop();
		
		// Emit event ChannelClosed
		dc.eventEmitter.emit( dc.CONSTANTS.Events.ChannelStarted );

	}
	
	
	/**
	 * Stop data channel
	 */
	stopDataChannel() {
		
		super.stopDataChannel();
		
		let dc = this;
		
		dc.stopMainLoop();

	}
	
}


module.exports = DC_SocketIO;