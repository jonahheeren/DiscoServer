var db = require('../database/db.js');
var request = require('request');

var init = function() {
    var pairs = pullPairs();

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
                pairs.forEach(pair => {
                    db.insertPairs(pair, row.name);
                });
            });
        });
    });
}

module.exports = { init }