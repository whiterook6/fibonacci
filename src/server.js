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

function pop_random_symbol(symbols){
	var index = Math.floor(Math.random() * symbols.length);
	var symbol = symbols[index];
	symbols.splice(index, 1);
	return symbol;
}

function add_new_player(data, socket){
	var player = new Player(data);
	players[player.symbol] = player;
	socket.player = player;

	var payload = {
		[player.symbol]: player.get_data()
	};
	socket.broadcast.emit('players.add', payload);

	payload[player.symbol].is_you = true;
	for (var symbol in players){
		if (players.hasOwnProperty(symbol) && symbol != player.symbol){
			var p = players[symbol];
			payload[symbol] = p.get_data();
		}
	}

	socket.emit('players.add', payload);
	return player;
}

io.on('connection', function(socket){
	if (available_player_symbols.length == 0){
		socket.emit('Room is full.');
		socket.disconnect();
		socket = null;
		return;
	}

	var player = add_new_player({
		symbol: pop_random_symbol(available_player_symbols)
	}, socket);

	socket.on('disconnect', () => {
		var symbol = player.symbol;
		available_player_symbols.push(symbol);
		io.emit('players.leave', symbol);

		delete players[symbol];
		delete socket.player;
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