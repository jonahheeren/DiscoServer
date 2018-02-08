var express = require('express');
var Kraken = require('../exchanges/kraken');
var krakenRouter = express.Router();
var kraken = new Kraken();

krakenRouter.get('/', function(req,res){
		res.send('hello from kraken')
	});

krakenRouter.get('/allPairs', function(req,res){
					kraken.getAllPairs(req,res);
				});
module.exports = krakenRouter;

