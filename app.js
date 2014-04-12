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
  name: String,
  location: String
});

var readingSchema = new mongoose.Schema({
  timestamp: Date,
  temp: Number,
  humidity: Number,
  pressure: Number,
  sensorId: Number
});

var SensorKit = mongoose.model('SensorKit', sensorKitSchema);

var sensorKitService = new SensorKitService(SensorKit);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

// sensorkits#index

app.get('/sensorkits', function(req, res){
  sensorKitService.index(function(response){
    res.json(response);
  });
});

// sensorkits#new

app.post('/sensorkits', function(req, res){
  sensorKitService.new(req.body.name, req.body.location, function(response){
    res.send(response);
  });
});

// sensorkits#show

app.get('/sensorkits/:id', function(req, res){
  sensorKitService.show(req.params.id, function(response){
    res.json(response);
  });
});

// sensorkit#destroy

app.delete('/sensorkits/:id', function(req, res){
  sensorKitService.destroy(req.params.id, function(response){
    res.send(response);
  });
});

// sensorkit#update

app.put('/sensorkits/:id', function(req, res){
  sensorKitService.update(req.params.id, req.body.name, req.body.location, function(response){
    res.send(response);
  });
});

app.post('/sensorkits/:id/readings', function(req, res){

});

app.get('/sensorkits/:id/:time', function(req, res){
  /*
  {
    "sensor": "1",
    "temp": "33",
    "humidity": "55",
    "pressure": "101"
  }
  */
});

app.get('/sensorkits/:time', function(req, res){
  /*
  [
    {
      "id": "1",
      "temp": "33",
      "humidity": "55",
      "pressure": "101"
    },
    {
      "id": "2",
      "temp": "34",
      "humidity": "56",
      "pressure": "101.2"
    }
  ]
  */
});

var server = app.listen(3000,  function() {
  console.dir(JSON.stringify(server.address()));
});