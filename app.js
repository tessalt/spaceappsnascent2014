// Dependencies
var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    logfmt = require("logfmt");

// custom modules
var SensorKitService = require('./services/sensorKit').SensorKitService,
    MeasurementService = require('./services/measurement').MeasurementService,
    SensorKit = require('./schemas/sensorKit'),
    Measurement = require('./schemas/measurement');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());
app.use(logfmt.requestLogger());

var port = Number(process.env.PORT || 3000);
var server = app.listen(port,  function() {
  console.dir("server listening on port " + server.address().port);
});

mongoose.connect('mongodb://localhost:27017/spaceapps');

var io = require('socket.io').listen(server);

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

app.get('/hello/:temp/:hum', function(req, res){
  measurementService.new(req.params.id, req.body, function(response){
    console.log('TEMP:' + req.params['temp'] + '\nHUM:' + req.params['hum']);
    
  });
});

// measurement#destroy
app.delete('/sensorkits/:id/measurements/:mid', function(req, res){
  measurementService.destroy(req.params.mid, function(response){
    res.send(response);
  });
});