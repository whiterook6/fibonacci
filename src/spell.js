let Model = require('./model');

class Spell extends Model {
	constructor(data){
		super();

		this.cooldown = 0; // in milliseconds
		this.cost = {};
		this.effects = {};
		this.color = '#2c3e50';

		this.fill(data);
	}

	get $fillable(){
		return [
			'symbol',
			'cooldown',
			'cost',
			'effects',
			'color'
		];
	}

	apply(effects, player){
		var any_updated = false;

		if (effects.hp){
			player.heal(effects.hp);
			any_updated = true;
		}
		
		if (effects.mp){
			player.recharge(effects.mp);
			any_updated = true;
		}
		return any_updated;
	}

	can_afford(player){
		if (this.cost.hp && player.get_hp() <= this.cost.hp){
			return false;
		}

		if (this.cost.mp && player.get_mp() < this.cost.mp){
			return false;
		}

		return true;
	}

	can_cast(player){
		if (!player.knows_spell(this)){
			console.log('Cannot cast: symbol missing');
			return false;
		}

		if (player.get_expected_expiry(this) > Date.now()){
			console.log('Cannot cast: symbol expired');
			return false;
		}

		if (!this.can_afford(player)){
			console.log('Cannot cast: cannot afford');
			return false;
		}

		return true;
	}

	cast(player, target, others){
		var target_symbol = null;
		if (target){
			target_symbol = target.get_symbol();
		}

		// update the cooldown. This means the spell cannot be cast again until the cooldown expires.
		player.set_expected_expiry(this, this.cooldown + Date.now());
		var affected = [];

		// if the spell affects the player, perform that effect.
		if (this.effects.self){
			this.apply(this.effects.self, player);
			affected.push(player);
		}

		// if this spell affects a target and the target isn't null, perform the target effect.
		if (this.effects.target && target){
			this.apply(this.effects.target, target);
			affected.push(target);
		}

		// if this spell affects others...
		if (this.effects.others){
			var others_effects = this.effects.others;

			// then perform the others effects
			for (var symbol in others){

				// on all others who aren't the target
				if (others.hasOwnProperty(symbol) && symbol != target_symbol){
					var other = others[symbol];
					this.apply(others_effects, other);
					affected.push(other);
				}
			}
		}

		return affected;
	}
}

module.exports = Spell;