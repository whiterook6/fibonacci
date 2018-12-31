console.log('Initializing...');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var protocols = require('./protocols');

console.log('Loading models...');
var Player = require('./player');
var Spell = require('./spell');

console.log('Loading data...');
var spells = require('./spells');
var all_player_symbols = require('./player_symbols');
var available_player_symbols = all_player_symbols.slice();
var players = {};

function pop_random_symbol(symbols){
	let index = Math.floor(Math.random() * symbols.length);
	let symbol = symbols[index];
	symbols.splice(index, 1);
	return symbol;
}

function add_new_player(data, socket){
	let player = new Player(data);
	players[player.symbol] = player;

	// send socket-io messages to alert other players and introduce this player
	protocols.players.add(socket, player, players);
	
	for (let symbol in spells){
		if (spells.hasOwnProperty(symbol)){
			let spell = spells[symbol];

			protocols.spells.teach(socket, spell);
			player.learn_spell(spell);
		}
	}

	return player;
}

io.on('connection', function(socket){
	if (available_player_symbols.length == 0){
		socket.emit('Room is full.');
		socket.disconnect();
		socket = null;
		return;
	}

	let symbol = pop_random_symbol(available_player_symbols);
	let player = add_new_player({symbol: symbol}, socket);

	socket.on('spells.cast', (symbol) => {
		if (!spells.hasOwnProperty(symbol)){
			return false;
		}

		let spell = spells[symbol];
		if (!spell.can_cast(socket.player)){
			return false;
		}

		let affected = spell.cast(socket.player, null, players);
		if (affected.length > 0){
			let payload = {};
			for (let i = affected.length - 1; i >= 0; i--) {
				let affected_player = affected[i];
				payload[affected_player.symbol] = affected_player.get_data();
			}

			io.emit('players.update', payload);
		}
	});

	socket.on('disconnect', () => {
		let symbol = socket.player.symbol;
		available_player_symbols.push(symbol);
		delete players[symbol];

		protocols.players.remove(socket);
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