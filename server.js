var http = require("http");
var express = require("express");
var io = require("socket.io");

var router = express();
var server = http.createServer(router);
server.listen(80);

var socket = io(server);

router.get('/',function(req,res){
	res.sendFile(__dirname+"/client.html");                         // introduce __dirname
});

var messages = [];                                                  // introduce multi-clients
var clients = [];
socket.on('connection', function(socket){

	var name;
	clients.push(socket);

	for (var i = 0; i < messages.length; i++) {
		socket.emit('message',messages[i]);
	}

	socket.on('join',function(data){
		console.log('Sending: join',data);
		sendToAll('join',data);
		name = data.name;
	})

	socket.on('message', function(data){
		console.log('Sending: message',data);
		sendToAll('message',data);
		messages.push(data);
	});

	socket.on('disconnect', function(){
		sendToAll('leave',{name:name});
	});

});

function sendToAll(msg,data) {
	console.log('Sending to everyone: '+msg,data);
	for (var i = 0; i < clients.length; i++) {
		clients[i].emit(msg,data);
	}
}

