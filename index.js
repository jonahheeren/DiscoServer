const PORT = process.env.PORT || 8080;

var express    = require('express'),
    bodyParser = require('body-parser'),
    db         = require('./database/db.js'),
    validate   = require('./helpers/validate.js'),
    poll       = require('./helpers/poll.js'),
    exchangesRoutes = require('./routes/exchangesRoutes');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

setInterval(poll.init, 5000);

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

app.get('/arbitrage', function(req, res) {
  arbitrage.getPairsWithArbitrage(function(err, response){
    if(err)
      console.log(err);
    else
      res.send(response);
  });
})

app.use('/exchange', exchangesRoutes);

app.get('/exchanges', function(req, res) {
  db.getExchanges().then(function(data) {
    res.send(data);
  }).catch(function(error) {
    res.sendStatus(500);
  });
});

app.get('/chatrooms', function(req, res) {
  db.getChatrooms().then(function(data) {
    res.send(data);
  }).catch(function(error) {
    res.sendStatus(500);
  });
});
/*
app.get('/chatmessages', function(req, res) {
  db.getChatMessages(req.query.room).then(function(data) {
    res.send(data);
  }).catch(function(error) {
    res.sendStatus(500);
  });
});
*/
app.get('/chatmessages', function(req, res) {
  db.getChatMessages(req.query.room).then(function(data) {
    res.send(data);
  }).catch(function(error) {
    res.sendStatus(500);
  });
});

app.post('/sendmessage', function(req, res) {
  console.log(JSON.stringify(req.body));
  db.sendMessage(req.body).then(function(data) {
      res.sendStatus(200);
  }).catch(function(error) {
    console.log(error);
    res.sendStatus(500);
  });
});

app.post('/insertbackup', function(req, res) {
  db.insertBackup(req.body).then(function(data) {
      res.sendStatus(200);
  }).catch(function(error) {
    console.log(error);
    res.sendStatus(500);
  });
});

app.get('/removebackup', function(req, res) {
  db.removeBackup(req.query.uuid).then(function(data) {
      res.sendStatus(200);
  }).catch(function(error) {
    console.log(error);
    res.sendStatus(500);
  });
});

app.get('/coin', function(req, res) {
  db.getCoinOnExchanges(req.query.shortname).then(function(data) {
    res.send(data);
  }).catch(function(error) {
    res.sendStatus(500);
  });
});

app.post('/user/stop', function(req, res) {
  if(validate.stop(req.body)) {
    db.insertStop(req.body).then(function(data, error) {
      res.sendStatus(200);
    }).catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    })
  }
  else {
    res.sendStatus(400);
  }
});

app.post('/user/trailstop', function(req, res) {
  if(validate.trailStop(req.body)) {
    db.PairExists(req.body.coinShort, req.body.marketShort, req.body.exchange).then(function(rows, error) {
      if(rows.length != 1) {
        res.sendStatus(404);
        return;
      }
      
      price = rows[0].price;
      
      db.insertTrailingStop(req.body, price).then(function(data, error) {
        res.sendStatus(200);
      }).catch(function(error) {
        console.log(error);
        res.sendStatus(500);
      })
    })
  }
  else {
    res.sendStatus(400);
  }
});

var server = app.listen(PORT, function() {
  console.log('Running Server on Port: ' + PORT);
});
