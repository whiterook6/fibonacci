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
			// (we'll reuse payload for another message)
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

		only: (io, players) => {
			if (players.length > 0){
				io.emit('players.only', players.map((player) => {
					return player.symbol;
				}));
			}
		},

		rename: (io, old_symbol, new_symbol) => {
			io.emit('players.rename', {
				old_symbol: old_symbol,
				new_symbol: new_symbol
			});
		},

		// when a player leaves
		remove: (io, socket) => {
			let player = socket.player;
			let symbol = player.symbol;

			// send to all other players
			io.emit('players.leave', symbol);

			// unlink the socket and player (for garbage collection)
			delete player.socket;
			delete socket.player;
		},

		update: (io, players) => {
			if (players.length > 0){
				let payload = {};
				for (let i = players.length - 1; i >= 0; i--) {
					let affected_player = players[i];
					payload[affected_player.symbol] = affected_player.get_data();
				}

				io.emit('players.update', payload);
			}
		},
	},

	// socket-io messages for managing spells
	spells: {

		// tell the player how long is left on a spell's cooldown, in milliseconds
		cooldown: (socket, player, spell) => {
			let payload = {
				symbol: spell.symbol,
				cooldown: Math.max(0, player.get_expected_expiry(spell) - Date.now())
			};
			socket.emit('spells.cooldown', payload);
		},

		// teach a new spell to a player
		teach: (socket, spell) => {
			socket.emit('spells.learn', spell.symbol);
		},
	}
};