const PORT = process.env.PORT || 8080;

var express = require('express'),
    nconf   = require('nconf');

var app = express();

nconf.file({
  file: './config/config.json'
});
if (!Object.keys(nconf.get()).length) {
  throw new Error('Unable to load config file. Check to make sure config/config.json exists');
}

app.get('/', function(req, res) { 
  res.sendStatus(200);
});

var server = app.listen(PORT, function() {
  console.log('Running Server on Port: ' + PORT);
});
