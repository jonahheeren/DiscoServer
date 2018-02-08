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

exports.userExists = uuid => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM User WHERE UUID = ?', uuid, function (error, results, fields) {
      if(error)
        reject(error);
      resolve(results);
    });
  });
}

exports.coinExists = (coinShortName, marketName) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM Pairs WHERE coid_id = ? AND market_id = ?', (coinShortName, marketName), function (error, results, fields) {
      if(error)
        reject(error);
      resolve(results);
    });
  });
}

exports.getExchanges= () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM Exchanges', function (error, results, fields) {
      if(error)
        reject(error);
      resolve(results);
    });
  });
}
