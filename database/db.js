var mysql = require('mysql'),
    nconf = require('nconf');

nconf.file({
  file: './config/config.json'
  });
  
if (!Object.keys(nconf.get()).length) {
  throw new Error('Unable to load config file. Check to make sure config/config.json exists');
  }


var connection = mysql.createConnection({
  host     : nconf.get('mysql').host,
  user     : nconf.get('mysql').user,
  password : nconf.get('mysql').password,
  database : nconf.get('mysql').database
});

connection.connect();

executeQuery = (query, parameters) => {
  return new Promise((resolve, reject) => {
    connection.query(query, parameters, function (error, results, fields) {
      if(error) {
        console.log(error);
        reject(error);
      }
      resolve(results);
    });
  });
}

exports.checkUser = uuid => {
  return executeQuery('SELECT * FROM User WHERE UUID = ?', uuid);
}

exports.addUser = uuid => {
  return executeQuery('INSERT INTO User VALUES(?, Now())', uuid);
}

exports.insertStop = (body) => {
  return executeQuery('INSERT INTO Stops (coin_short, market_short, exchange, size, price, side, is_executed, UUID) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
                        [body.coinShort, body.marketShort, body.exchange, body.size, body.price, parseInt(body.side), 0, body.uuid]);
}

exports.insertTrailingStop = (body, marketPrice) => {
  return executeQuery('INSERT INTO TrailStops (coin_short, market_short, exchange, trail, market_price, size, side, is_executed, UUID) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
                      [body.coinShort, body.marketShort, body.exchange, body.trail, marketPrice, body.size, parseInt(body.side), 0, body.uuid]);
}

exports.insertPairs = (pairs) => {
  return executeQuery('INSERT INTO Pairs (coin_short, market_short, price, exchange) VALUES ? ON DUPLICATE KEY UPDATE price=VALUES(price)',
                        [pairs]);
}

exports.getStops = () => {
  return executeQuery('SELECT * FROM Stops WHERE is_executed = 0', []);
}

exports.getTrails = () => {
  return executeQuery('SELECT * FROM TrailStops WHERE is_executed = 0', []);
}

exports.updateTrailMarketPrice = (price, coinShort, marketShort, exchange) => {
  return executeQuery('UPDATE TrailStops SET market_price = ? WHERE coin_short = ? AND market_short = ? AND exchange = ?',
                      [price, coinShort, marketShort, exchange]);
}

exports.markStop = (id) => {
  return executeQuery('UPDATE Stops SET is_executed = 1 WHERE id = ?', [id]);
}

exports.markTrail = (id) => {
  return executeQuery('UPDATE TrailStops SET is_executed = 1 WHERE id = ?', [id]);
}

exports.getPair = (coinShort, marketShort, exchange) => {
  return executeQuery('SELECT * FROM Pairs WHERE coin_short = ? AND market_short = ? AND exchange = ?', [coinShort, marketShort, exchange]);
}

exports.PairExists = (coinShort, marketShort, exchange) => {
  return executeQuery('SELECT * FROM Pairs WHERE coin_short = ? AND market_short = ? and exchange = ?', [coinShort, marketShort, exchange]);
}

exports.getAllPairsByExchange = (exchange) => {
  return executeQuery('SELECT * FROM Pairs WHERE exchange = ?', [exchange]);
}

exports.getExchanges = () => {
  return executeQuery('SELECT * FROM Exchanges', []);
}
