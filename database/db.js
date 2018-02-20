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
      if(error)
        reject(error);
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
  return executeQuery('INSERT INTO Stops (size, price, side, coin_id, market_id, is_executed) VALUES(?, ?, ?, ?, ?, ?)',
                        [body.size, body.price, body.side, body.coinId, body.marketId, 0]);
}

exports.insertPairs = (pairs) => {
  return executeQuery('INSERT INTO Pairs (coin_short, market_short, price, exchange) VALUES (?) ON DUPLICATE KEY UPDATE price=VALUES(price)',
                        pairs);
}

exports.PairExists = (coinId, marketId) => {
  return executeQuery('SELECT * FROM Pairs WHERE coin_id = ? AND market_id = ?', [coinId, marketId]);
}

exports.getExchanges = () => {
  return executeQuery('SELECT * FROM Exchanges', []);
}
