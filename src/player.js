let Model = require('./model');

class Player extends Model {
	constructor(data){
		super();
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

	get $fillable(){
		return [
			'symbol',
			'color',
			'stats',
		];
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

	get_hp(){
		return this.stats.hp.current;
	}

	get_mp(){
		return this.stats.mp.current;
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

module.exports = Player;