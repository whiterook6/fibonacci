import angular from 'angular';

angular
	.module('app', [])
	.controller('controller', ['$scope', '$interval', function($scope, $interval){
		let ctrl = this;
		ctrl.$scope = $scope;
		ctrl.$interval = $interval;

		ctrl.spells = [{
			color: 'red',
			symbol: 'ra-bottle-vapors',
			cooldown: 1000,
		}, {
			color: 'orange',
			symbol: 'ra-key',
			cooldown: 2500,
		}, {
			color: 'yellow',
			symbol: 'ra-arrow-cluster',
			cooldown: 5000,
		}, {
			color: 'blue',
			symbol: 'ra-diamond',
			cooldown: 10000,
		}, {
			color: 'purple',
			symbol: 'ra-dervish-swords',
			cooldown: 20000,
		}];

		ctrl.click = function(spell){
			var now = Date.now();
			if (spell.interval){
				return;
			}

			spell.last_cast = now;
			spell.expected_expiry = (spell.last_cast + spell.cooldown);

			spell.interval = ctrl.$interval(() => {
				var now = Date.now();
				if (now >= spell.expected_expiry){
					ctrl.$interval.cancel(spell.interval);
					spell.interval = null;
				} else {
					spell.cooldown_percentage = ((spell.expected_expiry - now)/spell.cooldown) * 100;
				}
			}, 10);
		};
	}]);