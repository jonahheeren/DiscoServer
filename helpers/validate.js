var db = require('../database/db.js')

var validator = require('validator');

exports.stop = input => {

  return (validCoinPair(input.coinId, input.marketId) &&
          validator.isUUID('' + input.uuid) &&
          validator.isFloat('' + input.size) &&
          validator.isFloat('' + input.price) &&
          validator.isBoolean('' + input.side));
}

function validCoinPair(coin_id, market_id) {
  return new Promise(function(resolve, reject) {
    db.PairExists(coin_id, market_id).then(function(rows, error) {
      if(error)
        reject(error);
      resolve(rows.length > 0);
    });
  });
}
