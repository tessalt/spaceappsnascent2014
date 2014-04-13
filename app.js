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

var server = app.listen(3000,  function() {
  console.dir("server listening on port " + server.address().port);
});

var io = require('socket.io').listen(server);

mongoose.connect('mongodb://localhost:27017/spaceapps');

var SensorKit = require('./schemas/sensorKit');

var Measurement = require('./schemas/measurement');

var sensorKitService = new SensorKitService(SensorKit);

var measurementService = new MeasurementService(Measurement);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/sensorkits', function(req, res){
  sensorKitService.index(function(response){
    res.json(response);
  });
});

app.post('/sensorkits', function(req, res){
  io.sockets.emit('random', {thing: 'stuffs'});
  sensorKitService.new(req.body.name, req.body.location, function(response){
    res.send(response);
  });
});

app.get(/^\/sensorkits\/(\d+\w+)?$/, function(req, res){
  sensorKitService.show(req.params[0], function(response){
    res.json(response);
  });
});

app.put('/sensorkits/:id', function(req, res){
  sensorKitService.update(req.params.id, req.body.name, req.body.location, function(response){
    res.send(response);
  });
});

app.delete('/sensorkits/:id', function(req, res){
  sensorKitService.destroy(req.params.id, function(response){
    res.send(response);
  });
});

app.get('/sensorkits/measurements', function(req, res){
  measurementService.index(null, req.query, function(response){
    res.json(response);
  });
});

app.get('/sensorkits/:id/measurements', function(req, res){
  measurementService.index(req.params.id, req.query, function(response){
    res.json(response);
  });
});

app.post('/sensorkits/:id/measurements', function(req, res){
  measurementService.new(req.params.id, req.body, function(response){
    res.send(response);
  });
});

app.delete('/sensorkits/:id/measurements/:mid', function(req, res){
  measurementService.destroy(req.params.mid, function(response){
    res.send(response);
  });
});