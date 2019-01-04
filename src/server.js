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
var server = {
	spells: require('./spells'),
	all_player_symbols: require('./player_symbols'),
	players: {}
};
server.available_player_symbols = server.all_player_symbols.slice();

function pop_random_symbol(symbols){
	let index = Math.floor(Math.random() * symbols.length);
	let symbol = symbols[index];
	symbols.splice(index, 1);
	return symbol;
}

function add_new_player(data, socket){
	let player = new Player(data);
	server.players[player.symbol] = player;

	// send socket-io messages to alert other players and introduce this player
	protocols.players.add(socket, player, server.players);
	
	for (let symbol in server.spells){
		if (server.spells.hasOwnProperty(symbol)){
			let spell = server.spells[symbol];

			protocols.spells.teach(socket, spell);
			player.learn_spell(spell);
		}
	}

	return player;
}

io.on('connection', function(socket){
	if (server.available_player_symbols.length == 0){
		socket.emit('Room is full.');
		socket.disconnect();
		socket = null;
		return;
	}

	let symbol = pop_random_symbol(server.available_player_symbols);
	let player = add_new_player({symbol: symbol}, socket);
	protocols.players.only(io, server.players);

	socket.on('spells.cast', (symbol) => {
		if (!server.spells.hasOwnProperty(symbol)){
			return;
		}

		let spell = server.spells[symbol];
		if (!spell.can_cast(socket.player)){
			return;
		}

		let affected = spell.cast(socket.player, null, server.players);
		protocols.players.update(io, affected);
		protocols.spells.cooldown(socket, socket.player, spell);
	});

	socket.on('disconnect', () => {
		let symbol = socket.player.symbol;
		server.available_player_symbols.push(symbol);
		delete server.players[symbol];

		protocols.players.remove(socket);
	});
});

app.use(express.static('public'));
app.get('/symbols/players', (_, response) => {
	response.send(JSON.stringify(all_player_symbols));
});
app.get('/symbols/players/available', (_, response) => {
	response.send(JSON.stringify(available_player_symbols));
});
app.get('/players', (_, response) => {
	let payload = server.players.map((player) => {
		return player.get_data();
	});
	response.send(JSON.stringify(payload));
})
app.get('/spells', (_, response) => {
	response.send(JSON.stringify(spells));
});
http.listen(8000, () => {
	console.log('Server started.');
});