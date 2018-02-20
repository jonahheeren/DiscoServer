
exports.getAllPairs = function(exchangeName, callback){
		var Exchange = require('../exchanges/' + exchangeName);
		var exchange = new Exchange();
		//console.log(exchange);
		exchange.api('allPairs', {}, function(err, response){
		    if(err){
		      callback(null);
		    } 

		    exchange.handleAllPairs(response, function(err, response){
		    	callback(null, response);
		    });
		    
		    //return pairs;
		});
}