# Documentation

## Socket IO protocol

Definitions:

- `self`: the client sending/receiving the message (ra-dragon in this example)
- `server`: the server receiving/sending the message
- `target`: another client (ra-beetle in this example)
- `others`: all other clients
- `clients`: all clients

## List of Socket IO Routes

### Players

#### Adding players: `players.add`

```
{
	'ra-beetle': {
		// player definition
		is_you: true // only if the it's the client's object
	},
	// ...
}

#### Updating Players: `players.update`

```
// server to clients
{
	'ra-beetle': {
		// things to update; not all fields of a player needed.
	},
	// ...
}
```

#### Player leaving: `players.leave`

```
// Server to all clients
ra-beetle // one symbol only, currently
```

#### List of players: `players.only`

```
// server to all clients
[
	`ra-beetle`,
	// ... symbols only.
]
```

### Spells

#### Teach spell: `spells.learn`

```
// server to one client
ra-bottle-vapors // one spell symbol
```

#### Activate Spell Cooldown: `spells.cooldown`

```
// server to one client
{
	'symbol': 'ra-bottle-vapors',
	'cooldown': 20000, // milliseconds until ready
}
```
