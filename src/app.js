import angular from 'angular';
import Player from './player.js';
import Spell from './spell.js';
import spells from './spells.js';

angular
	.module('app', [])
	.controller('controller', ['$scope', '$interval', function($scope, $interval){
		let ctrl = this;
		ctrl.$scope = $scope;
		ctrl.$interval = $interval;
		ctrl.cooldowns = {};
		ctrl.intervals = {};
		ctrl.spells = spells;
		ctrl.players = {};
		ctrl.player = null;

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
						console.log('adding player');
						ctrl.add_player(symbol, data);
					} else {
						console.log('updating player');
						var player = ctrl.players[symbol];
						ctrl.update_player(player, data);
					}

					if (ctrl.player.symbol == symbol){
						console.log('updating core player');
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
			if (!ctrl.spells.hasOwnProperty(message.symbol)){
				return;
			}

			let spell = ctrl.spells[message.symbol];
			ctrl.player.set_expected_expiry(spell, Date.now() + message.cooldown);
			ctrl.cooldowns[spell.symbol] = 100;

			ctrl.intervals[spell.symbol] = ctrl.$interval(() => {
				let now = Date.now(),
					remaining = Math.max(0, ctrl.player.get_expected_expiry(spell) - now),
					percentage = Math.min(100, (remaining * 100) / (spell.cooldown));

				ctrl.cooldowns[spell.symbol] = percentage;

				if (remaining <= 0){
					ctrl.$interval.cancel(ctrl.intervals[spell.symbol]);
					delete ctrl.intervals[spell.symbol];
				}
			}, 20);
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
				return;
			}

			ctrl.socket.emit('spells.cast', {
				spell: {
					symbol: spell.symbol
				}
			});
		};
	}]);
