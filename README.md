# Documentation

## Socket IO protocol

Definitions:

- `self`: the client sending/receiving the message (ra-dragon in this example)
- `server`: the server receiving/sending the message
- `target`: another client (ra-beetle in this example)
- `others`: all other clients
- `clients`: all clients

### List of Socket IO Routes

`players.add` tell others about new player(s)
{
	'ra-beetle': {
		symbol: ra-beetle,
		color: '#ccc',
		hp: {
			current: 100,
			max: 100
		},
		mp: {
			current: 50,
			max: 50
		}
	}
}

`player.update` tell others about update to player, keyed by (old) symbol name
{
	'ra-beetle': {
		hp: {
			current: 50,
			max: 100
		},
	}
}

`player.leave` tell others about player leaving, keyed by (old) symbol name
{
	'ra-beetle': null
}

`self.update` tell server that you want to change something, like symbol name
{
	symbol: 'ra-beetle'
}

`self.update` tell client that self is updated, possibly after being hit by a spell
{
	hp: {
		current: 50,
		max: 75
	},
	symbol: 'ra-beetle'
}

`spell.cast` tell server that you want to cast a spell.
{
	symbol: 'ra-potion',
	target: 'ra-beetle' // null if no target
}

`spell.cast` tell self, target, others, clients that a spell has been cast by a player
{
	symbol: 'ra-potion',
	source: 'ra-dragon',
	target: 'ra-beetle' // null if no target
}



