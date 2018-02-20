var express = require('express');
var db = require('../database/db');
// var Exchange = require('../exchanges/');
var exchangeRouter = express.Router();
//var exchange = new Exchange();

exchangeRouter.get('/:exchangeName/allPairs', function(req,res){
	db.getAllPairsByExchange(req.params.exchangeName).then(function(data) {
    res.send(data);
  }).catch(function(error) {
    res.sendStatus(500);
  });
});

		// var Exchange = require('../exchanges/' + req.params.exchangeName);
		// var exchange = new Exchange();

		// var response = exchange.getAllPairs(function(err, response){
		// 	if(err) {
		// 		res.send(err);
		// 	}
		// 	var pairs = exchange.handleAllPairs(response);
		// 	res.send(pairs);
		// });
		//res.send(response);
		// db.getAllPairsByExchange(req.params.exchangeName)


module.exports = exchangeRouter;