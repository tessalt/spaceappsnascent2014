var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var SensorKitService = require('./services/sensorKit').SensorKitService;
var MeasurementService = require('./services/measurement').MeasurementService;

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());

mongoose.connect('mongodb://localhost:27017/spaceapps');

var sensorKitSchema = new mongoose.Schema({
  name: String,
  location: { type: String, required: true }
});

var measurementSchema = new mongoose.Schema({
  sensorId: [mongoose.Schema.Types.ObjectId],
  timestamp: { type: Date, default: Date.now },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  pressure: { type: Number, required: true }
});

var SensorKit = mongoose.model('SensorKit', sensorKitSchema);

var Measurement = mongoose.model('Measurement', measurementSchema);

var sensorKitService = new SensorKitService(SensorKit);

var measurementService = new MeasurementService(Measurement);

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

app.get('/measurements', function(req, res){
  measurementService.all(function(response){
    res.json(response);
  });
});

// measurement#index

app.get('/sensorkits/:id?/measurements', function(req, res){
  measurementService.index(req.params.id, req.query, function(response){
    res.json(response);
  });
});

// measurement#new

app.post('/sensorkits/:id/measurement', function(req, res){
  measurementService.new(req.params.id, req.body, function(response){
    res.send(response);
  });
});

// measurement#destroy

app.delete('/sensorkits/:id/measurement/:mid', function(req, res){
  measurementService.destroy(req.params.mid, function(response){
    res.send(response);
  });
});

var server = app.listen(3000,  function() {
  console.dir("server listening on port " + server.address().port);
});