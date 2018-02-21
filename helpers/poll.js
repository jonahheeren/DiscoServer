var db = require('../database/db.js');
var request = require('request');

var init = function() {
  pullPairs();
  checkLimits();
  checkLosses();
  checkTrailLosses();
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
      })
    });
  })
}

function checkLosses() {
  db.getLosses().then(function(losses, errors) {
    losses.forEach(loss => {
      db.getPair(loss.coin_short, loss.market_short, loss.exchange).then(function(pair, errors) {
        if(loss.price >= pair[0].price) {
          console.log("should sell");
          db.markStop(loss.id);
        }
      })
    });
  })
}

module.exports = { init }
