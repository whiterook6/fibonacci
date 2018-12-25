function get_percentage(current, max){
	return ((current * 100) / max) + '%';
}

class Player {
	constructor(symbol){
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
		this.symbol = symbol || null;

		this.expected_expiries = {};
		this.spells = {};
	}

	get_status(){
		return {
			hp: this.stats.hp.current,
			hp_percentage: get_percentage(this.stats.hp.current, this.stats.hp.max),
			mp: this.stats.mp.current,
			mp_percentage: get_percentage(this.stats.mp.current, this.stats.mp.max),
		};
	}

	get_symbol(){
		return this.symbol;
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

module.exports = Player;