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

		ctrl.socket = io();
		ctrl.socket.on('change-symbol', (symbol) => {
			ctrl.player = new Player(symbol);
			ctrl.$scope.$apply();
		});
	}]);