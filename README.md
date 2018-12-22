# Icon Battle

This is a test to get websockets working with a simple game. It's also a chance to make a simple game.

# Ideas

- Players cast spells using icons.
- Spells have effects such as
	- healing;
	- damaging others;
	- gaining power; and
	- casting another spell.
- Use websockets and node to power it.
- Timers determine cooldowns for spells.
- Players have HP and MP.
- If players loses all their MP or HP they lose.

# Plan

## Step 1

Get socket-io working, so users can pass font icons back and forth.
- basically an icon-only chat history.

Done.

## Step 2

Game planning, basics:
- players
- spells
- HP

player:
	symbol
	name
	hp
	available_spells: [
    	symbol
    	name
    	description
    	effect	
	]

game:
	players
	history: [
		id =>
			symbol
			source
			target
			timestamp
	]
