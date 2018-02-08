var validator = require('validator');

exports.stop = function(input) {
  return (
    validator.isUUID('' + input.uuid) &&
    validator.isFloat('' + input.size) &&
    validator.isFloat('' + input.price) &&
    validator.isBoolean('' + input.side) &&
    coinExists(input.coinShortname)
  );
}

function coinExists() {
  
}