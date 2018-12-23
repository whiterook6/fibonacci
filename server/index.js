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

io.on('connection', function(socket){
	console.log('Player connecting');
	socket.player = new Player(socket);

	socket.on('change-symbol', function(symbol){

		var player = socket.player;
		if (player.symbol && player.symbol == symbol){
			return;
		}

		var index = available_player_symbols.indexOf(symbol);
		if (index != -1){

			// return the old symbol for others to use
			if (player.symbol){
				available_player_symbols.push(player.symbol);
			}
			player.set_symbol(symbol);
			available_player_symbols.splice(index, 1);
			socket.emit('change-symbol', symbol);
		}
	});

	socket.on('get-status', function(){
		socket.emit('current-status', socket.player.get_status());
	});

	socket.on('get-cooldowns', function(){
		var cooldowns = {};
		for (var symbol in socket.player.cooldowns){
			if (socket.player.cooldowns.hasOwnProperty(symbol) && spells.hasOwnProperty(symbol)){
				cooldowns[symbol] = spells[symbol].get_cooldown_remaining(socket.player);
			}
		}

		socket.emit('current-cooldowns', cooldowns);
	});

	socket.on('cast-spell', function(cast){ // cast = { spell_symbol: 'ra-...', target_symbol: 'ra-...' (optional)}
		if (!spells.hasOwnProperty(cast.spell_symbol)){
			return;
		}

		var spell = spells[cast.spell_symbol];
		if (!spell.can_cast(socket.player)){
			return;
		}

		var target_symbol = cast.target_symbol || null;
		if (target_symbol){
			if (!players.hasOwnProperty(cast.target_symbol)){
				return;
			}
		}

		spell.cast(socket.player, players[target_symbol], players);
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