var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var mongo = require('mongo');
var mongoose = require('mongoose');
var SensorKitService = require('./services/sensorKit').SensorKitService;

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());

mongoose.connect('mongodb://localhost:27017/spaceapps');

var sensorKitSchema = new mongoose.Schema({
  id: Number,
  location: String
});

var SensorKit = mongoose.model('SensorKit', sensorKitSchema);

var sensorKitService = new SensorKitService(SensorKit);

app.get('/', function(req, res){
  res.send('here be nodez');
});

app.get('/sensorkits', function(req, res){
  sensorKitService.index(function(response){
    res.json(response);
  });
});

app.post('/sensorkits', function(req, res){
  sensorKitService.new(req.body.id, req.body.location, function(response){
    res.send(response);
  });
});

var server = app.listen(3000,  function() {
  console.dir(JSON.stringify(server.address()));
});