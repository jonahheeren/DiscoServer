var db = require('../database/db.js');
var request = require('request');
var api = require('../apis/exchange');

var init = function() {
    var pairs = pullPairs();

}

function pullPairs() {
    db.getExchanges().then(function(rows, errors) {
        rows.forEach(row => {
            api.getAllPairs(row.name, function(err, pairs){
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