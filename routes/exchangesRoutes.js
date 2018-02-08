var express = require('express');
// var Exchange = require('../exchanges/');
var exchangeRouter = express.Router();
//var exchange = new Exchange();

exchangeRouter.get('/:exchangeName/allPairs', function(req,res){
		var Exchange = require('../exchanges/' + req.params.exchangeName);
		var exchange = new Exchange();
		exchange.getAllPairs(req,res);
	});


module.exports = exchangeRouter;