const PORT = process.env.PORT || 8080;

var express = require('express'),
    nconf   = require('nconf'),
    mysql   = require('mysql');

var app = express();

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

app.get('/', function(req, res) { 
  connection.query('SELECT * FROM User;', function (error, results, fields) {
    res.send(200);
  });
});

app.get('/user/exists', function(req, res) {
  connection.query('SELECT * FROM User WHERE UID = ?', req.query.uid, function (error, results, fields) {
    console.log("Error: " + error);
    if(results && results.length === 1)
      res.sendStatus(200);
    else 
      res.sendStatus(404);
    
  });
})

var server = app.listen(PORT, function() {
  console.log('Running Server on Port: ' + PORT);
});
