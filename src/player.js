class Player {
	constructor(data){
		this.stats = {
			hp: {
				current: 100,
				max: 100
			},
			mp: {
				current: 100,
				max: 100
			}
		};

		this.symbol = null; // 'ra-beetle'
		this.spells = {}; // {'ra-bottle': Spell}
		this.expected_expiries = {}; // {'ra-bottle': Date.now()}

		this.fill(data);
	}

	// adds whatever data is passed into the model, filtering by the $fillable
	// array (see below).
	fill(data){
		for (var i = Player.$fillable.length - 1; i >= 0; i--) {
			var key = Player.$fillable[i];
			if (data.hasOwnProperty(key)){
				this[key] = data[key];
			}
		}

		return this;
	}

	// creates a packet suitable for sending by socket.
	get_data(){
		return {
			stats: this.stats,
			symbol: this.symbol
		};
	}

	get_expected_expiry(spell){
		if (this.expected_expiries.hasOwnProperty(spell.symbol)){
			return this.expected_expiries[spell.symbol];
		}
	}

	// adds (or subtracts, for negative numbers) a given amount of HP, respecting the minimum
	// and maximum limits.
	heal(additional_hp){
		this.stats.hp.current = Math.max(
			Math.min(
				this.stats.hp.current + additional_hp,
				this.stats.hp.max
			),
			0
		);

		return this;
	}

	// returns true if the player knows this spell, false otherwise.
	knows_spell(spell){
		return this.spells.hasOwnProperty(spell.symbol);
	}

	// teaches the spell to this player, if he/she doesn't already know it.
	learn_spell(spell){
		let symbol = spell.symbol;

		if (!this.knows_spell(symbol)){
			this.spells[symbol] = spell;
			this.set_expected_expiry(spell, Date.now());
		}

		return this;
	}

	// adds (or subtracts, for negative numbers) a given amount of MP, respecting the minimum
	// and maximum limits.
	recharge(additional_mp){
		this.stats.mp.current = Math.max(
			Math.min(
				this.stats.mp.current + additional_mp,
				this.stats.mp.max
			),
			0
		);

		return this;
	}

	set_expected_expiry(spell, expected_expiry){
		this.expected_expiries[spell.symbol] = expected_expiry;
	}
}

// used to filter what data can be set on the player.
Player.$fillable = [
	'symbol',
	'color',
	'stats',
];

module.exports = Player;