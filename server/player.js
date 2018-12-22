class Player {
	constructor(){
		this.hp = 100;
		this.mp = 100;
		this.cooldowns = {};
	}

	learn_spell(spell){
		if (this.learned_spells[spell.symbol] != null){
			return;
		}

		this.cooldowns[spell.symbol] = Date.now();
	}

	set_symbol(symbol){
		this.symbol = symbol;
	}

	get_symbol(){
		return this.symbol || null;
	}

	get_status(){
		return {
			hp: this.hp,
			mp: this.mp
		};
	}
}

module.exports = Player;