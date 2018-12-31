module.exports = {

	// socket-io messages for managing players
	players: {

		// when a player joins
		add: (socket, player, players) => {

			// link socket and player
			socket.player = player;
			player.socket = socket;

			// let others know about this player
			let symbol = player.symbol;
			let payload = {
				[symbol]: player.get_data()
			};

			// send to all other players
			socket.broadcast.emit('players.add', payload);

			// let this player know about all the others
			payload[symbol].is_you = true;
			for (other_symbol in players){
				if (players.hasOwnProperty(other_symbol) && symbol != other_symbol){
					let other_player = players[other_symbol];
					payload[other_symbol] = other_player.get_data();
				}
			};

			// send to this player a list of all other players
			socket.emit('players.add', payload);
		},

		// when a player leaves
		remove: (socket) => {
			let player = socket.player;
			let symbol = player.symbol;

			// send to all other players
			socket.broadcast.emit('players.leave', symbol);

			// unlink the socket and player (for garbage collection)
			delete player.socket;
			delete socket.player;
		}
	},

	// socket-io messages for managing spells
	spells: {

		// teach a new spell to a player
		teach: (socket, spell) => {
			socket.emit('spells.learn', spell.symbol);
		}
	}
};