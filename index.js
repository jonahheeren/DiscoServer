const PORT = process.env.PORT || 8080;

var express    = require('express'),
    bodyParser = require('body-parser'),
    db         = require('./database/db.js'),
    validate   = require('./validate.js');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/', function(req, res) { 
  connection.query('SELECT * FROM User;', function (error, results, fields) {
    res.send(200);
  });
});

app.get('/user/exists', function(req, res) {
  db.checkUser().then(function(data) {
    res.sendStatus(200);
  }).catch(function(error) {
    res.sendStatus(404);
  });
});

app.get('/exchanges', function(req, res) {
  db.getExchanges().then(function(data) {
    res.send(data);
  }).catch(function(error) {
    res.sendStatus(500);
  });
});

app.post('/user/stop', function(req, res) {
  if (!req.body) return res.sendStatus(400);
  res.send(validate.stop(req.body));
});

var server = app.listen(PORT, function() {
  console.log('Running Server on Port: ' + PORT);
});
