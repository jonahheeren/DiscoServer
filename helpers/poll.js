var db = require('../database/db.js');
var request = require('request');

var init = function() {
    var pairs = pullPairs();
    //checkLimits();
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

module.exports = { init }
