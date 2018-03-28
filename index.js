const PORT = process.env.PORT || 8080;

var express    = require('express'),
    bodyParser = require('body-parser'),
    db         = require('./database/db.js'),
    validate   = require('./helpers/validate.js'),
    poll       = require('./helpers/poll.js'),
    exchangesRoutes = require('./routes/exchangesRoutes'),
    arbitrage       = require('./helpers/arbitrage.js'),
    twitter         = require('./helpers/twitter.js')
var Graph = require('./helpers/graph');
var exArbitrage = require('./helpers/arbitrage2.js');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

setInterval(poll.init, 5000);

var graph = new Graph();
/*
graph.addNode("ETH");
graph.addNode("NAS");
graph.addNode("USDT");
graph.addNode("BTC");
graph.addNode("NEO");

graph.addEdge("ETH", "NAS", (0.0130870000));
graph.addEdge("NAS", "ETH", (1/0.0130870000));

graph.addEdge("BTC", "NAS", (0.0007734000));
graph.addEdge("NAS", "BTC", (1/0.0007734000));

graph.addEdge("USDT", "NAS", (6.0571000000));
graph.addEdge("NAS", "USDT", (1/6.0571000000));


graph.addEdge("ETH", "NEO", (0.1194750000));
graph.addEdge("NEO", "ETH", (1/0.1194750000));

graph.addEdge("BTC", "NEO", (0.0070740000));
graph.addEdge("NEO", "BTC", (1/0.0070740000));

graph.addEdge("USDT", "NEO", (56.0500000000));
graph.addEdge("NEO", "USDT", (1/56.0500000000));


graph.addEdge("USDT", "ETH", (461.5300000000));
graph.addEdge("ETH", "USDT", (1/461.5300000000));

graph.addEdge("BTC", "ETH", (0.0585610000));
graph.addEdge("ETH", "BTC",(1/0.0585610000));

graph.addEdge("USDT", "BTC", (7860.0000000000));
graph.addEdge("BTC", "USDT", (1/7860.0000000000));

console.log(graph);

graph.findAllPaths("ETH", "ETH"); 
*/

//graph.bellmanFord("ETH");
//graph.bfs("ETH");
//console.log(graph._nodes);
//console.log(graph._edges);

// exArbitrage.populateGraph(function(err, graph){
//   if(err)
//     console.log(err);
//   else
//     console.log(graph._nodes);
// });

// var log1 = Math.log(0.1);
// var log2 = Math.log(4);
// var log3 = Math.log(2.5);
// var tot = log1 + log2 + log3;
// var logTot = Math.log(tot);

// console.log("log1: " + log1 + " log2: " + log2 + " log3: " + log3);
// console.log("tot: " + tot + " logOf1: " + Math.log(1));
//dexArbitrage.arbitrageOnCoin("ETH");


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
app.get('/arbitrage/:exchangeName/:coinShort', function(req, res){
  exArbitrage.arbitrageDFS(req.params.exchangeName, req.params.coinShort, 10, 6, function(err, arbitragePaths){
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

app.get('/twitter', function(req, res) {
  var params = {
    q: "" + req.query.query,
    count: req.query.count
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
