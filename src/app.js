import angular from 'angular';

angular
	.module('app', [])
	.controller('controller', ['$scope', function($scope){
		let ctrl = this;
		ctrl.$scope = $scope;
		ctrl.socket = io();

		ctrl.current = {
			symbol: 'ra-beetle'
		};
		ctrl.player_symbols = [
			'ra-beetle',
			'ra-bird-claw',
			'ra-butterfly',
			'ra-cat',
			'ra-dinosaur',
			'ra-dragon',
			'ra-dragonfly',
			'ra-eye-monster',
			'ra-fairy',
			'ra-fish',
			'ra-fox',
			'ra-gecko',
			'ra-hydra',
			'ra-insect-jaws',
			'ra-lion',
			'ra-love-howl',
			'ra-maggot',
			'ra-octopus',
			'ra-rabbit',
			'ra-raven',
			'ra-sea-serpent',
			'ra-seagull',
			'ra-shark',
			'ra-sheep',
			'ra-snail',
			'ra-snake',
			'ra-spider-face',
			'ra-spiked-tentacle',
			'ra-spiral-shell',
			'ra-suckered-tentacle',
			'ra-tentacle',
			'ra-two-dragons',
			'ra-venomous-snake',
			'ra-wyvern',
			'ra-wolf-head',
			'ra-wolf-howl',
		];

		ctrl.change_player = function(new_symbol){
			ctrl.current.symbol = new_symbol;
		};
	}]);