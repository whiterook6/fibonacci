class Spell {
	constructor(data){
		this.cooldown = 0; // in milliseconds
		this.cost = {};
		this.effects = {};
		this.color = '#2c3e50';

		this.fill(data);
	}

	apply(player){
		var any_updated = false;

		if (this.effect.hp){
			player.heal(this.effect.hp);
			any_updated = true;
		}
		
		if (this.effect.mp){
			player.recharge(this.effect.mp)
			any_updated = true;
		}
	
		return any_updated;
	}

	can_afford(player){
		if (this.cost.hp && player.hp <= this.cost.hp){
			return false;
		}

		if (this.cost.mp && player.mp < this.cost.mp){
			return false;
		}

		return true;
	}

	can_cast(player){
		if (!player.expected_expiries.hasOwnPropety(this.symbol)){
			return false;
		}

		if (player.expected_expiries[symbol] > Date.now()){
			return false;
		}

		if (!this.can_afford(this.cost, player)){
			return false;
		}

		return true;
	}

	cast(player, target, others){
		if (!this.can_cast(player)){ // this check includes cooldown.
			return false;
		}

		var target_symbol = null;
		if (target){
			target_symbol = target.get_symbol();
		}

		// update the cooldown. This means the spell cannot be cast again until the cooldown expires.
		player.expected_expiries[this.symbol] = this.cooldown + Date.now();
		affected = [];

		// if the spell affects the player, perform that effect.
		if (this.effects.player){
			apply(this.effects.player, player);
			affected.push(player);
		}

		// if this spell affects a target and the target isn't null, perform the target effect.
		if (this.effects.target && target){
			apply(this.effects.target, target);
			affected.push(target);
		}

		// if this spell affects others...
		if (this.effects.others){
			var others_effects = this.effects.others;

			// then perform the others effects
			for (var symbol in others){

				// on all others who aren't the target
				if (others.hasOwnPropety(symbol) && symbol != target_symbol){
					var other = others[symbol];
					this.apply(others_effects, other);
					affected.push(other);
				}
			}
		}

		return affected;
	}

	fill(data){
		for (var i = Spell.$fillable.length - 1; i >= 0; i--) {
			var key = Spell.$fillable[i];
			if (data.hasOwnProperty(key)){
				this[key] = data[key];
			}
		}
	}
}

Spell.$fillable = [
	'symbol',
	'cooldown',
	'cost',
	'effects',
	'color'
];

module.exports = Spell;