import angular from 'angular';
import Player from './player.js';
import Spell from './spell.js';
import spells from './spells.js';

angular
	.module('app', [])

	// long press directive: calls a function if the mouse is held long enough
	// <button long-press="ctrl.my_function()">Button</button>
	.directive('longPress', ['$timeout', function($timeout){
		return {
			restrict: 'A',
			scope: {
				'longPress': '&'
			},
			link: function(scope, element, attributes){
				let timeout = null;
				element.on('mousedown', (event) => {
					if (timeout == null){
						$timeout.cancel(timeout);
					}

					timeout = $timeout(() => {
						timeout = null;
						scope.longPress();
					}, 1000);
				});
				element.on('mouseup', (event) => {
					if (timeout != null){
						$timeout.cancel(timeout);
					}
				});
			}
		}
	}])
	.controller('controller', ['$scope', '$interval', function($scope, $interval){
		let ctrl = this;
		ctrl.$scope = $scope;
		ctrl.$interval = $interval;
		ctrl.cooldowns = {};
		ctrl.intervals = {};
		ctrl.spells = spells;
		ctrl.players = {};
		ctrl.player = null;
		ctrl.repeating = {};

		ctrl.socket = io();
		ctrl.socket.on('players.add', (message) => {
			for (let symbol in message){
				if (message.hasOwnProperty(symbol)){
					if (message[symbol].is_you){
						ctrl.player = new Player(message[symbol]);
					}

					ctrl.add_player(symbol, message[symbol]);
				}
			}
			ctrl.$scope.$apply();
		});

		ctrl.socket.on('players.update', (message) => {
			for (let symbol in message){
				if (message.hasOwnProperty(symbol)){
					let data = message[symbol];

					if (!ctrl.knows_player(symbol)){
						ctrl.add_player(symbol, data);
					} else {
						var player = ctrl.players[symbol];
						ctrl.update_player(player, data);
					}

					if (ctrl.player.symbol == symbol){
						ctrl.update_player(ctrl.player, data);
					}
				}
			}
			ctrl.$scope.$apply();
		});

		ctrl.socket.on('players.leave', (symbol) => {
			if (ctrl.knows_player(symbol)){
				ctrl.forget_player(symbol);
			}
			ctrl.$scope.$apply();
		});

		ctrl.socket.on('players.only', (symbols) => {
			ctrl.players.forEach((player) => {
				if (symbols.indexOf(player.symbol) == -1){
					ctrl.forget_player(player.symbol);
				}
			});
		});

		ctrl.socket.on('spells.learn', (symbol) => {
			if (!ctrl.spells.hasOwnProperty(symbol)){
				return;
			}

			let spell = ctrl.spells[symbol];

			if (!ctrl.player.knows_spell(spell)){
				ctrl.player.learn_spell(spell);
				ctrl.$scope.$apply();
			}
		});

		ctrl.socket.on('spells.cooldown', (message) => {

			// if the client doesn't know this spell, just abort.
			if (!ctrl.spells.hasOwnProperty(message.symbol)){
				return;
			}

			// get the spell
			let spell = ctrl.spells[message.symbol];

			// if the cooldown has no time left
			if (message.cooldown <= 0){

				// release the spell and set cooldown to 0
				ctrl.player.set_expected_expiry(spell, Date.now());
				ctrl.cooldowns[spell.symbol] = 0;
				ctrl.$interval.cancel(ctrl.intervals[spell.symbol]);

				// if the spell is repeating, try to cast it again, and set the repeating to false
				// if it cannot be cast.
				ctrl.repeating[spell.symbol] = ctrl.cast_spell(spell);

				// done, if the cooldown was 0. Otherwise
				return;
			}

			// otherwise, the cooldown is positive, and so the spell cannot be cast for a while

			// set the expiry for this spell
			ctrl.player.set_expected_expiry(spell, Date.now() + message.cooldown);

			// start with a full cooldown
			ctrl.cooldowns[spell.symbol] = 100;

			// animate the cooldown percentage, and do some stuff when it reaches 0.
			ctrl.intervals[spell.symbol] = ctrl.$interval(() => {

				// update the cooldown
				let now = Date.now(),
					remaining = Math.max(0, ctrl.player.get_expected_expiry(spell) - now),
					percentage = Math.min(100, (remaining * 100) / (spell.cooldown));
				ctrl.cooldowns[spell.symbol] = percentage;

				// if we've expired
				if (remaining <= 0){

					// cancel the animation
					ctrl.$interval.cancel(ctrl.intervals[spell.symbol]);
					delete ctrl.intervals[spell.symbol];

					// if the spell is set to repeat, now is the time to try and cast it again
					if (ctrl.repeating[spell.symbol]){

						// try to cast the spell and set repeating to false if it doesn't work
						ctrl.repeating[spell.symbol] = ctrl.cast_spell(spell);
					}
				}
			}, 20); // 50 times per second
		});

		ctrl.knows_player = (symbol) => {
			return ctrl.players.hasOwnProperty(symbol);
		};

		ctrl.forget_player = (symbol) => {
			delete ctrl.players[symbol];
		};

		ctrl.update_player = (player, data) => {
			player.fill(data);
		};

		ctrl.add_player = (symbol, data) => {
			ctrl.players[symbol] = new Player(data);
		};

		ctrl.cast_spell = (spell) => {
			if (!spell.can_cast(ctrl.player)){
				return false;
			}

			ctrl.socket.emit('spells.cast', {
				spell: {
					symbol: spell.symbol
				}
			});

			return true;
		};

		ctrl.toggle_repeating = (spell) => {
			if (!ctrl.repeating.hasOwnProperty(spell.symbol)){
				ctrl.repeating[spell.symbol] = true;
			} else {
				ctrl.repeating[spell.symbol] = !ctrl.repeating[spell.symbol];
			}
		};
	}]);
