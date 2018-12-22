/**
 * adds or subtracts hp and/or mp to/from the target. Return true iff any change was made.
 */
function apply(effect, target){
	var any_updated = false;

	if (effect.hp && effect.hp != 0){
		target.hp += effect.hp;
		any_updated = true;
	}
	
	if (effect.mp && effect.mp != 0){
		target.mp += effect.mp;
		any_updated = true;
	}
	
	return any_updated;
}

/**
 * Returns true iff the target can afford the cost in HP and MP.
 */
function check(cost, target){
	if (cost.hp && player.hp <= cost.hp){
		return false;
	}

	if (cost.mp && player.mp < cost.mp){
		return false;
	}

	return true;
}

class Spell {
	constructor(data){
		this.symbol = data.symbol;
		this.cooldown = data.cooldown || 0; // in milliseconds
		this.cost = data.cost || {};
		this.effects = data.effects || {};
		this.color = data.color || '#2c3e50';
	}

	can_cast(player){
		if (!player.cooldowns.hasOwnPropety(this.symbol)){
			return false;
		}

		if (player.cooldowns[symbol] + this.cooldown > Date.now()){
			return false;
		}

		if (!this.check(this.cost, player)){
			return false;
		}

		return true;
	}

	get_cooldown_remaining(player){
		if (!player.cooldowns.hasOwnPropety(this.symbol)){
			return (this.cooldown + player.cooldowns[this.symbol]) - Date.now();
		} else {
			return 0;
		}
	}

	cast(player, target, others){
		if (!can_cast(player)){ // this check includes cooldown.
			return false;
		}

		var target_symbol = null;
		if (target){
			target_symbol = target.get_symbol();
		}

		// update the cooldown. This means the spell cannot be cast again until the cooldown expires.
		player.cooldowns[this.symbol] = Date.now();

		// if the spell affects the player, perform that effect.
		if (this.effects.player){
			if (apply(this.effects.player, player)){
				player.socket.emit('update', player.get_status());
			}
		}

		// if this spell affects a target and the target isn't null, perform the target effect.
		if (this.effects.target && target){
			if (apply(this.effects.target, target)){
				target.socket.emit('update', target.get_status());
			}
		}

		// if this spell affects others...
		if (this.effects.others){
			var others_effects = this.effects.others;

			// then perform the others effects
			for (var symbol in others){

				// on all others who aren't the target
				if (others.hasOwnPropety(symbol) && symbol != target_symbol){
					var other = others[symbol];
					if (apply(others_effects, other)){
						other.socket.emit('update', other.get_status());
					}
				}
			}
		}
	}

	as_message(){
		return {
			symbol: this.symbol,
			cooldown: this.cooldown,
			previous_cast_time: this.previous_cast_time,
			cost: this.cost,
			effects: this.effects,
			color: this.color,
		};
	}
}

module.exports = Spell;