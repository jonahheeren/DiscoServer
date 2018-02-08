var express = require('express');
var Binance = require('../exchanges/binance');
var binanceRouter = express.Router();
var binance = new Binance();

binanceRouter.get('/', function(req,res){
		res.send('hello from binance')
	});

binanceRouter.get('/allPairs', function(req,res){
					binance.getAllPairs(req,res);
				});
module.exports = binanceRouter;