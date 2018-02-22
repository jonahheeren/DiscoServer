var db = require('../database/db.js');

exports.pullAllPairs = function() {
	db.getPairs().then(function(rows, errors) {
		var dbRows = [];
		rows.forEach(row => {
			dbRows.push([row.coin_short, row.market_short]);
		});
		db.insertAllPairs(dbRows);
	});
}
exports.getPairsWithArbitrage = function(callback) {
	db.getAllPairs().then(function(allPairs, errors){
		db.getPairs().then(function(pairs,errors){
			var arbPairs = [];
			allPairs.forEach(allPair => {
				var samePairs = [];
				pairs.forEach(pair => {
					if(allPair.coin_short == pair.coin_short && allPair.market_short == pair.market_short)
						samePairs.push(pair);
				});
				copySamePairs = samePairs;
				if(samePairs.length > 1) {
					samePairs.forEach(pair => {
						copySamePairs.forEach(copyPair => {
							var arbPair = {};
							var pcntDiff;
							if(pair.exchange != copyPair.exchange && pair.price > copyPair.price){		
								pcntDiff = (pair.price - copyPair.price) / copyPair.price;
								if(pcntDiff > 0.1) {
									
									arbPair.first = pair;
									arbPair.second = copyPair;
									arbPair.pcntDiff = pcntDiff;

									arbPairs.push(arbPair);
								}
							}

						});
					});
				}

			});
			callback(null, arbPairs);
		});
	});
}
