var db = require('../database/db.js');
var request = require('request');

var init = function() {
    var pairs = pullPairs();
    //checkLimits();
}

function pullPairs() {
  db.getExchanges().then(function(rows, errors) {
    rows.forEach(row => {
      request('http://127.0.0.1:8080/exchange/' + row.name +'/allPairs', function(err, response, body) {
        var dbRows = [];
        var data = JSON.parse(body);
        data.forEach(pair => {
          dbRows.push([pair.coin, pair.market, parseFloat(pair.price), row.name]);
        });    
        db.insertPairs(dbRows);
      });
    });
  });
}

module.exports = { init }