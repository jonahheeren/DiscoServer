var db = require('../database/db.js')

var validator = require('validator');

exports.stop = input => {

  return (validCoinPair(input.coinShort, input.marketShort) &&
          validator.isUUID('' + input.uuid) &&
          validator.isFloat('' + input.size) &&
          validator.isFloat('' + input.price) &&
          validator.isBoolean('' + input.side));
}

function validCoinPair(coinShort, marketShort) {
  return new Promise(function(resolve, reject) {
    db.PairExists(coinShort, marketShort).then(function(rows, error) {
      if(error)
        reject(error);
      resolve(rows.length > 0);
    });
  });
}
