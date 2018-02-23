var db = require('../database/db.js');
var request = require('request');
var arbitrage = require('./arbitrage.js')

var init = function() {
  pullPairs();
  db.getPair("BTC", "USDT", "GateIO").then(function(pair, errors) {
    console.log('BTC, USD: ' + pair[0].price);
    checkStops();
    checkTrails();
    arbitrage.pullAllPairs();
  });
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

function checkStops() {
  db.getStops().then(function(stops, errors) {
    stops.forEach(stop => {

      db.getPair(stop.coin_short, stop.market_short, stop.exchange).then(function(pair, errors) {
        if(stop.price  >= pair[0].price) {
          const sideWord = (stop.side == 0) ? 'sell' : 'buy';
          console.log("should " + sideWord + " order");
          db.markStop(stop.id);
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
          db.markTrail(trail.id);
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
