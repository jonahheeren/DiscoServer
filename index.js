const PORT = process.env.PORT || 8080;

var express    = require('express'),
    bodyParser = require('body-parser'),
    db         = require('./database/db.js'),
    validate   = require('./validate.js'),
    exchangesRoutes = require('./routes/exchangesRoutes');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/user', function(req, res) {
  db.checkUser(req.query.uuid).then(function(data) {
    if(data.length === 1)
      res.sendStatus(200);
    else {
      db.addUser(req.query.uuid).then(function(status) {
          res.sendStatus(204);
      })
    }
  }).catch(function(error) {
    console.log(error);
    res.sendStatus(500);
  });
});

app.use('/exchange', exchangesRoutes);

app.get('/exchanges', function(req, res) {
  db.getExchanges().then(function(data) {
    res.send(data);
  }).catch(function(error) {
    res.sendStatus(500);
  });
});

app.post('/user/stop', function(req, res) {
  if (!req.body) return res.sendStatus(400);
  console.log(validate.stop(req.body));
  if(validate.stop(req.body)) {
    db.insertStop(req.body).then(function(data) {
      
    }).catch(function(error) {
      
    })
  }
  else {
    res.sendStatus(400);
  }

  res.send();
});

var server = app.listen(PORT, function() {
  console.log('Running Server on Port: ' + PORT);
});
