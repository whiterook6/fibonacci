var Spell = require('./spell');
var spell_data = [{
	symbol: 'ra-dripping-sword',
	cooldown: 5000,
	cost: {
		mp: 10
	},
	effects: {
		self: {
			mp: -10
		},
		target: {
			hp: -30
		}
	},
	color: '#c0392b'
}, {
	symbol: 'ra-heart-bottle',
	cooldown: 3000,
	cost: {
		mp: 10
	},
	effects: {
		self: {
			hp: 15,
			mp: -10
		}
	},
	color: '#e74c3c'
}, {
	symbol: 'ra-burning-meteor',
	cooldown: 20000,
	cost: {
		mp: 50
	},
	effects: {
		self: {
			mp: -50,
		},
		others: {
			hp: -50
		}
	},
	color: '#6F1E51'
}, {
	symbol: 'ra-bottle-vapors',
	cooldown: 10000,
	effects: {
		self: {
			mp: 50
		}
	},
	color: '#A3CB38'
}];

module.exports = {};
for (var i = spell_data.length - 1; i >= 0; i--) {
	var datum = spell_data[i];
	module.exports[datum.symbol] = new Spell(datum);
};