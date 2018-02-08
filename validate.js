var db = require('./database/db.js')

var validator = require('validator');

exports.stop = input => {
  return (
    /*validator.isUUID('' + input.uuid) &&
    validator.isFloat('' + input.size) &&
    validator.isFloat('' + input.price) &&
    validator.isBoolean('' + input.side) &&*/
    coinExists(input.coinShortname)
  );
}

function coinExists() {
  db.coinExists().then(function(data) {
    console.log('data: ' + data);
    return true;
  }).catch(function(error) {
    console.log(error);
  });
}