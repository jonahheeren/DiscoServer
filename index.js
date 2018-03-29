const PORT = process.env.PORT || 8080;

var express    = require('express'),
    bodyParser = require('body-parser'),
    db         = require('./database/db.js'),
    validate   = require('./helpers/validate.js'),
    poll       = require('./helpers/poll.js'),
    exchangesRoutes = require('./routes/exchangesRoutes'),
    arbitrage       = require('./helpers/arbitrage.js'),
    twitter         = require('./helpers/twitter.js'),
    notify          = require('./helpers/notify.js'),
    exArbitrage     = require('./helpers/arbitrage2.js');



var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

setInterval(poll.init, 5000);

app.get('/user', function(req, res) {
  console.log(req.query.fcm_token);
  db.checkUser(req.query.uuid).then(function(data) {
    if(data.length === 1) {
      db.updateFCMToken(req.query);
      res.sendStatus(200);
    }
    else {
      db.addUser(req.query).then(function(status) {
          res.sendStatus(204);
      })
    }
  }).catch(function(error) {
    console.log(error);
    res.sendStatus(500);
  });
});
app.get('/arbitrage/:exchangeName/:coinShort', function(req, res){
  exArbitrage.arbitrageDFS(req.params.exchangeName, req.params.coinShort, 10, 5, function(err, arbitragePaths){
    if(err) {
      console.log(err);
    } else {
      res.send(arbitragePaths);
    }
  });
});
app.get('/arbitrage', function(req, res) {
  arbitrage.getPairsWithArbitrage(function(err, response){
    if(err)
      console.log(err);
    else
      res.send(response);
  });
});

app.get('/notifications', function(req, res) {
  db.getNotifications(req.query.uuid).then(function(err, response){
    if(err) {
      res.send(500);
    } else {
      if(response.length > 0) {
        res.send(response);
      } else {
        res.sendStatus(404);
      }
    }
  });
});

app.get('/testnotification', function(req, res) {
  notify.sendTestMessage().then(function(response, err){
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

/**
 * TODO: Add validation and more statuses
 */
app.get('/chatmessages', function(req, res) {
  db.getChatMessages(req.query.room).then(function(data) {
    if(data.length > 0)
      res.send(data[0]);
    else
      res.sendStatus(404);
  }).catch(function(error) {
    res.sendStatus(500);
  });
});

/**
 * TODO: Add validation and more statuses
 */
app.post('/sendmessage', function(req, res) {
  console.log(JSON.stringify(req.body));
  db.sendMessage(req.body).then(function(data) {
    res.sendStatus(200);
  }).catch(function(error) {
    console.log(error);
    res.sendStatus(400);
  });
});

/**
 * TODO: This route should return 3 statuses
 * and use the validator once we're ready
 * to only use valid UUIDs.
 * 1. Valid insert
 * 2. UUID is updated
 * 3. 500 for weird failures. 
 */
app.post('/insertbackup', function(req, res) {
  db.insertBackup(req.body).then(function(data) {
      res.sendStatus(200);
  }).catch(function(error) {
    console.log(error);
    res.sendStatus(400);
  });
});

/**
 * TODO: This route should return 3 statuses
 * and use the validator once we're ready
 * to only use valid UUIDs.
 * 1. Valid Removal
 * 2. UUID does not exist, rowsAffected = 0
 * 3. 500 for weird failures. 
 */
app.get('/removebackup', function(req, res) {
  db.removeBackup(req.query.uuid).then(function(data) {
      res.sendStatus(200);
  }).catch(function(error) {
    console.log(error);
    res.sendStatus(400);
  });
});

app.get('/twitter', function(req, res) {
  var params = {
    q: "" + req.query.query,
    count: req.query.count,
    filter: 'verified'
  }
  twitter.getTweets(params).then(function(tweets) {
    res.send(tweets);
  }).catch(function(error) {
    console.log(error);
    res.sendStatus(500);
  });
});

app.get('/coin', function(req, res) {
  db.getCoinOnExchanges(req.query.shortname).then(function(data) {
    if(data.length > 0)
      res.send(data);
    else
      res.sendStatus(404);
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

module.exports = server;
