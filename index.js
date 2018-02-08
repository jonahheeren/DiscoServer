const PORT = process.env.PORT || 8080;

var express = require('express'),
    nconf   = require('nconf'),
    mysql   = require('mysql');
    

/** Kraken Client **/

// const key          = '8k7pV8MLQjQT+vBpbHrZDYOmBepz2t1IDIznxzcdiA+i9WlMU0V71w/8'; // API Key
// const secret       = 'UTJwQjFBmDmw94U9Qn/hC4vbTh2oU3C4iLDie59SioxwRk6N6zLShmVnKnXpNPky0tSQv1+lc/7eLCgIkDZWeQ=='; // API Private Key
// const KrakenClient = require('./exchanges/krakenEx');
// const krakenClient = new KrakenClient(key, secret);

// var Kraken = require('./exchanges/kraken')
// const kraken = new Kraken();
// /* Gate.io */

// const gateioEx = require('./exchanges/gateioEx')
// const Gateio = require('./exchanges/gateio')
// const gateio = new Gateio();


/*Exchange*/

//const exchangeAPI(krakenReal) = require('./exchanges/exchange')

/**/

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


var krakenRoutes = require('./routes/krakenRoutes');
var gateioRoutes = require('./routes/gateioRoutes');
app.use('/kraken', krakenRoutes);
app.use('/gateio', gateioRoutes);

app.get('/', function(req, res) { 
  connection.query('SELECT * FROM User;', function (error, results, fields) {
    res.send(200);
  });
});


app.get('/hello', function(req, res) {
  res.send('Welcome to my APIs');
});



var server = app.listen(PORT, function() {
  console.log('Running Server on Port: ' + PORT);
});
