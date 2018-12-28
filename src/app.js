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
						ctrl.add_player(symbol, data);
					} else {
						ctrl.update_player(symbol, data);
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

		ctrl.knows_player = (symbol) => {
			return ctrl.players.hasOwnProperty(symbol);
		};

		ctrl.forget_player = (symbol) => {
			delete ctrl.players[symbol];
		};

		ctrl.update_player = (symbol, data) => {
			for (let key in data){
				if ((data.hasOwnProperty(key)) && (Player.fillable.indexOf(key) != -1)){
					ctrl.players[symbol][key] = data[key];
				}
			}
		};

		ctrl.add_player = (symbol, data) => {
			ctrl.players[symbol] = new Player(data);
		};
	}]);
