var db = require('../database/db.js');
var request = require('request');
var arbitrage = require('./arbitrage.js')
var arbitrage2 = require('./arbitrage2.js')
var notify = require('./notify.js')

var init = function() {
  pullPairs();
  db.getPair("BTC", "USDT", "GateIO").then(function(pair, errors) {
    checkStops();
    checkTrails();
    checkArbitrage();
    checkArbitrageKeys();
  });
}

function checkArbitrageKeys(){
  db.getArbitrageKeys().then(function(keys, err){
    keys.forEach(key => {
      var hasKey = false;
      arbitrage.getPairsWithArbitrage(function(err, response) {
        response.forEach(row => {
          var arbKey = row.first.coin_short + row.first.market_short;
          if(arbKey === key.key) {
            hasKey = true;
          }
        })
        if(!hasKey){
          db.removeArbitrageKey(key.key);
        }
      })
    })
  })
}

function checkArbitrage() {
  arbitrage.getPairsWithArbitrage(function(err, response) {
    response.forEach(row => {
      var arbKey = row.first.coin_short + row.first.market_short;
      var hasKey = false;
      db.hasArbitrageKey(arbKey).then(function(coin, errs){
        
        if(coin.length === 0) {
          db.insertArbitrageKey(arbKey);
          db.getArbitrageDevices().then(function(users, err) {
            if(users) {
              notify.sendMessage(users, row);
            }
          })
        }
      });
    })
  });
}
function pullPairs() {
    db.getExchanges().then(function(rows, errors) {
        rows.forEach(row => {
            var Exchange = require('../exchanges/' + row.name);
            var exchange = new Exchange();
            exchange.getAllPairs(function(err, pairs){
                if(err){
                    return;
                    
                }
                var dbRows = [];
                pairs.forEach(pair => {
                    dbRows.push([pair.coin, pair.market, parseFloat(pair.price) || 0, row.name]);
                });
                db.insertPairs(dbRows);
            });
        });
    });
}

function checkStops() {
  db.getStops().then(function(stops, errors) {
    stops.forEach(stop => {

      db.getPair(stop.coin_short, stop.market_short, stop.exchange).then(function(pair, errors) {
        if(stop.price  >= pair[0].price) {
          const sideWord = (stop.side == 0) ? 'sell' : 'buy';
          console.log("should " + sideWord + " order");
          db.getUsers(stop.UUID).then(function(user) {
            notify.sendTradeMessage(user[0], stop.coin_short, stop.market_short, stop.exchange, stop.size, stop.side);
            db.markStop(stop.id);
          });
        }
      });
    });
  });
}

function checkTrails() {
  db.getTrails().then(function(trails, errors) {
    trails.forEach(trail => {

      const multiplier = (trail.side == 0) ? 1 : -1;

      db.getPair(trail.coin_short, trail.market_short, trail.exchange).then(function(pair, errors) {
        if((trail.market_price * multiplier) < (pair[0].price * multiplier)) {
          db.updateTrailMarketPrice(pair[0].price, trail.coin_short, trail.market_short, trail.exchange);
        }
        if(((trail.market_price - (trail.trail * multiplier )) * multiplier) >= pair[0].price * multiplier) {
          db.getUsers(trail.UUID).then(function(user) {
            notify.sendTradeMessage(user[0], trail.coin_short, trail.market_short, trail.exchange, trail.size,  trail.side);
            db.markTrail(trail.id);
          });
          const sideWord = (trail.side == 0) ? 'sell' : 'buy';
          console.log("Trail exceeded, should " + sideWord);
          console.log('Market Price for Trail: ' + trail.market_price);
          console.log('Current Price: ' + pair[0].price);
          console.log('trail amount: ' + trail.trail);
        }
      });
    });
  });
}


module.exports = { init }
