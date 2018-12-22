var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', function(socket){
	socket.on('message', function(message){
		socket.broadcast.emit('message', message);
	});
});

http.listen(8000);