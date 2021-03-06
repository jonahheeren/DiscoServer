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
    scrape     = require('./helpers/exchange_vol.js');



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
  exArbitrage.arbitrageDFS(req.params.exchangeName, req.params.coinShort, function(err, arbitragePaths){
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
      res.send(data);
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
    db.getSubscribers(req.body.chatroom_id).then(function(users) {
      notify.sendChatMessage(users, req.body.chatroom_id, req.body.uid, req.body.message)
    });
    res.sendStatus(200);
  }).catch(function(error) {
    console.log(error);
    res.sendStatus(400);
  });
});

/**
 * TODO: Add validation and more statuses
 */
app.post('/subchat', function(req, res) {
  db.addsub(req.body).then(function(data) {
    res.sendStatus(200);
  }).catch(function(error) {
    console.log(error);
    res.sendStatus(500);
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
    result_type: 'popular',
    filter: 'verified',
    lang: 'en'
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

app.get('/exchangesvolume', function(req, res) {
  scrape.exchangeVolume().then(function(data) {
    res.send(data);
  });
});

app.get('/exchangePairsVolume/:exchangeName', function(req, res) {
  scrape.exchangeCoinPairVolume(req.params.exchangeName).then(function(data) {
    res.send(data);
  });
});

app.post('/numberoflikedcoins', function(req, res) {
  db.getCoinLikeCount(req.body).then(function(data) {
    if(data.length > 0)
      res.send(data);
    else
      res.sendStatus(404);
  }).catch(function(error) {
    res.sendStatus(500);
  });
});

app.post('/insertlikedcoin', function(req, res) {
  db.insertCoinLike(req.body).then(function(data) {
      res.sendstatus(200);
  }).catch(function(error) {
    res.sendStatus(500);
  });
});

app.post('/removewatchlist', function(req, res) {
  db.removeCoinLike(req.body).then(function(data) {
      res.sendstatus(200);
  }).catch(function(error) {
    res.sendStatus(500);
  });
});

app.get('/userlikedcoin', function(req, res) {
  db.getWatchlists().then(function(data) {
    if(data.length > 0)
      res.send(data);
    else
      res.sendStatus(404);
  }).catch(function(error) {
    res.sendStatus(500);
  });
});


app.get('/coins', function(req, res) {
  db.getCoins().then(function(data) {
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
    db.PairExists(req.body.coin_short, req.body.market_short, req.body.exchange).then(function(rows, error) {
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
