var db = require('../database/db.js');
var request = require('request');

var init = function() {
  pullPairs();
  checkLimits();
  checkLosses();
  checkTrailLosses();
  checkTrailLimits();
}

function pullPairs() {
    db.getExchanges().then(function(rows, errors) {
        rows.forEach(row => {
            var Exchange = require('../exchanges/' + row.name);
            var exchange = new Exchange();
            exchange.getAllPairs(function(err, pairs){
                if(err){
                    console.log(err);
                }
                var dbRows = [];
                pairs.forEach(pair => {
                    dbRows.push([pair.coin, pair.market, parseFloat(pair.price), row.name]);
                });
                db.insertPairs(dbRows);
            });
        });
    });
}

function checkLimits() {
  db.getLimits().then(function(limits, errors) {
    limits.forEach(limit => {
      db.getPair(limit.coin_short, limit.market_short, limit.exchange).then(function(pair, errors) {
        if(limit.price <= pair[0].price) {
          console.log("should place order")
          db.markStop(limit.id);
        }
      });
    });
  });
}

function checkLosses() {
  db.getLimits().then(function(limits, errors) {
    limits.forEach(limit => {
      db.getPair(limit.coin_short, limit.market_short, limit.exchange).then(function(pair, errors) {
        if(limit.price >= pair[0].price) {
          console.log("should sell order")
          db.markStop(limit.id);
        }
      });
    });
  });
}

function checkTrailLosses() {
  db.getTrailLosses().then(function(trailLosses, errors) {
    trailLosses.forEach(trailLoss => {
      db.getPair(trailLoss.coin_short, trailLoss.market_short, trailLoss.exchange).then(function(pair, errors) {
        if(trailLoss.price < pair[0].price) {
          db.updateTrailMarketPrice(pair[0].price, trailLoss.coin_short, trailLoss.market_short, trailLoss.exchange);
        }
        else {
          if(trailLoss.price - pair[0].price >= trailLoss.trail) {
            //execute trailLoss
          }
        }
      });
    });
  });
}

function checkTrailLimits() {
  db.getTrailLimits().then(function(trailLosses, errors) {
    trailLosses.forEach(trailLoss => {
      db.getPair(trailLoss.coin_short, trailLoss.market_short, trailLoss.exchange).then(function(pair, errors) {
        if(trailLoss.price > pair[0].price) {
          db.updateTrailMarketPrice(pair[0].price, trailLoss.coin_short, trailLoss.market_short, trailLoss.exchange);
        }
        else {
          if(trailLoss.price - pair[0].price <= trailLoss.trail) {
            //execute trailLimit
          }
        }
      });
    });
  });
}

module.exports = { init }
