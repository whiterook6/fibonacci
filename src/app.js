import angular from 'angular';
import 

angular
	.module('app', [])
	.controller('controller', ['$scope', function($scope){
		let ctrl = this;
		ctrl.$scope = $scope;
		ctrl.socket = io();
		ctrl.current = {
			player_symbol: null,
			spell_symbol: null,
			target_symbol: null,
			
			cooldowns: {},
			status: {},
		};
		
		ctrl.get_status = function(){
			ctrl.socket.emit('get-status');
		};

		ctrl.get_cooldowns = function(){
			ctrl.socket.emit('get-cooldowns');
		};

		ctrl.change_player = function(new_symbol){
			if (ctrl.current_symbol != new_symbol){
				ctrl.socket.emit('change-symbol', new_symbol);
			}
		};

		ctrl.choose_spell = function(symbol){
			ctrl.current.spell = symbol;
		};

		ctrl.choose_target = function(symbol){
			ctrl.current.target = symbol;
		};

		ctrl.cast = function(){
			ctrl.socket.emit('cast-spell', {
				target_symbol: ctrl.current.target_symbol || null,
				spell_symbol: ctrl.current.spell_symbol,
			});
		};

		ctrl.socket.on('change-symbol', function(symbol){
			ctrl.current.player_symbol = symbol;
		});

		ctrl.socket.on('update', function(status){
			ctrl.current.status = status;
		});

		ctrl.socket.on('current-cooldowns', function(cooldowns){
			ctrl.current.cooldowns = cooldowns;
		})
	}]);