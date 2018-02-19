var db = require('../database/db.js');
var request = require('request');

var init = function() {
    var pairs = pullPairs();

}

function pullPairs() {
    db.getExchanges().then(function(rows, errors) {
        rows.forEach(row => {
            request('http://127.0.0.1:8080/exchange/' + row.name +'/allPairs', function(err, response, body) {
                var data = JSON.parse(body);
                data.forEach(pair => {
                    db.insertPairs(pair, row.name);
                });
            });
        });
    });
}

module.exports = { init }