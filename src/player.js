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

		this.symbol = null;
		this.expected_expiries = {};
		this.spells = {};

		this.fill(data);
	}

	get_data(){
		return {
			stats: this.stats,
			symbol: this.symbol
		};
	}

	fill(data){
		for (var i = Player.fillable.length - 1; i >= 0; i--) {
			var key = Player.fillable[i];
			if (data.hasOwnProperty(key)){
				this[key] = data[key];
			}
		}
	}

	heal(additional_hp){
		this.stats.hp.current = Math.max(
			Math.min(
				this.stats.hp.current + additional_hp,
				this.stats.hp.max
			),
			0
		);
		return this.stats.hp.current;
	}

	learn_spell(spell){
		if (expected_expiries.hasOwnProperty(spell.symbol)){
			return false;
		}

		this.spells[spell.symbol] = spell;
		this.expected_expiries[spell.symbol] = Date.now();
		return true;
	}

	recharge(additional_mp){
		this.stats.mp.current = Math.max(
			Math.min(
				this.stats.mp.current + additional_mp,
				this.stats.mp.max
			),
			0
		);
		return this.stats.mp.current;
	}

	set_symbol(symbol){
		if (!symbol){
			return false;
		}

		this.symbol = symbol;
		return true;
	}
}

Player.fillable = [
	'symbol',
	'color',
	'stats',
]

module.exports = Player;