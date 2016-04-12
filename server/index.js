var express = require('express');
var mysql = require("mysql");
var path = require('path');
var connect = require('connect');

var port = "3000"
var publicDir = path.resolve(__dirname + '/../public');

var autoIncrementingUserId = 0;

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'memory'
});

connection.connect(function(err) {
  if(!err) {
      console.log("Forbindelse til databasen oprettet");
  } else {
      console.log("Fejl i oprettelse af forbindelse til databasen");
  }
});

var app = express();
app.use(express.static(publicDir, {maxAge : 0}));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

app.post('/user', function (req, res) {
  autoIncrementingUserId++;
  connection.query('INSERT INTO memory_scores SET username = "Bruger' + autoIncrementingUserId + '", score = "' + req.body.time + '"', function(err, res) {
    if(err) {
      console.log('Bruger data blev ikke gemt');
    } else {
      console.log('Brugerdata blev gemt');
    }
  });
  res.end();
});

app.use('*', function (req, res) {
  res.set('Content-Type', 'text/html');
  res.sendFile(publicDir + '/index.html');
});

app.listen(port);
