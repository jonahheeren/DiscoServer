var db = require('./database/db.js')

var validator = require('validator');

exports.stop = input => {
  return (
    validator.isUUID('' + input.uuid) &&
    validator.isFloat('' + input.size) &&
    validator.isFloat('' + input.price) &&
    validator.isBoolean('' + input.side) &&
    validCoin(input.coin, input.market, input.exchange)
  );
}

function validCoin(coin, market, exchange) {
  db.coinExists(coin, market, exchange).then(function(rows) {
    console.log(rows);
    console.log(rows.length > 0);
    return (rows.length > 0);
  }).catch(function(error) {
    console.log(error);
    return false;
  });
}
