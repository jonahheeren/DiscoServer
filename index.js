const PORT = process.env.PORT || 8080;

var express = require('express');

var app = express();

app.get('/', function(req, res) { 
    res.sendStatus(200);
});

var server = app.listen(PORT, function() {
    console.log('Running Server on Port: ' + PORT);
});
