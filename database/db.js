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

exports.coinExists = (coinShortName, marketName, exchange) => {
  return executeQuery('SELECT * FROM Markets WHERE id = ? AND coin = ? AND ex_name = ?', [marketName, coinShortName, exchange]);
}

exports.getExchanges = () => {
  return executeQuery('SELECT * FROM Exchanges', []);
}