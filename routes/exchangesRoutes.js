var express = require('express');
var db = require('../database/db');
var exchangeRouter = express.Router();

exchangeRouter.get('/:exchangeName/allPairs', function(req,res){
	db.getPairsByExchange(req.params.exchangeName).then(function(data) {
    res.send(data);
  }).catch(function(error) {
    res.sendStatus(500);
  });
});

module.exports = exchangeRouter;