var express = require('express');
var gateio = require('../exchanges/gateio');

var gateioRouter = express.Router();
var gateio = new gateio();

gateioRouter.get('/', function(req,res){
		res.send('hello from gateio')
	});

gateioRouter.get('/allPairs', function(req,res){
					gateio.getAllPairs(req,res);
				});

module.exports = gateioRouter;