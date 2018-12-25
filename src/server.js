console.log('Initializing...');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

console.log('Loading models...');
var Player = require('./player');
var Spell = require('./spell');

console.log('Loading data...');
var spells = require('./spells');
var all_player_symbols = require('./player_symbols');
var available_player_symbols = all_player_symbols.slice();
var players = {};

function get_random_symbol(symbols){
	var index = Math.floor(Math.random() * symbols.length);
	var symbol = symbols[index];
	symbols.splice(index, 1);
	return symbol;
}

io.on('connection', function(socket){
	if (available_player_symbols.length == 0){
		socket.emit('Room is full.');
		socket.disconnect();
		return;
	}

	var symbol = get_random_symbol(available_player_symbols);
	socket.player = new Player(symbol);
	socket.emit('change-symbol', symbol);
	players[symbol] = socket.player;
	console.log(socket.player);

	socket.on('disconnect', () => {
		var symbol = socket.player.get_symbol();
		available_player_symbols.push(symbol);
		delete players[symbol];
	});
});

app.use(express.static('public'));
app.get('/symbols/players', function(_, response) {
	response.send(JSON.stringify(all_player_symbols));
});
app.get('/symbols/players/available', function(_, response) {
	response.send(JSON.stringify(available_player_symbols));
});
app.get('/spells', function(_, response){
	response.send(JSON.stringify(spells));
});
http.listen(8000, function(){
	console.log('Server started.');
});