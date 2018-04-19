var db = require('../database/db.js')

var validator = require('validator');

exports.stop = input => {

  return (validCoinPair(input.coinShort, input.marketShort, input.exchange) &&
          validator.isFloat('' + input.size) &&
          validator.isFloat('' + input.price) &&
          validator.isBoolean('' + input.side));
}

exports.trailStop = input => {
  return (validCoinPair(input.coinShort, input.marketShort, input.exchange) &&
          validator.isFloat('' + input.size) &&
          validator.isBoolean('' + input.side)) &&
          validator.isFloat('' + input.trail);
}

function validCoinPair(coinShort, marketShort, exchange) {
  return new Promise(function(resolve, reject) {
    db.PairExists(coinShort, marketShort, exchange).then(function(rows, error) {
      if(error)
        reject(error);
      resolve(rows.length > 0);
    });
  });
}
