var MeasurementService = function(measurementModel) {
  this.measurementModel = measurementModel;
}

MeasurementService.prototype.index = function(id, query, callback) {
  var search = {};
  if (id) {
    search.sensorId = id;
  }
  if (query.from) {
    search.timestamp = {
      $gte: new Date(query.from),
      $lt: Date.now()
    }
  }
  this.measurementModel.find(search).sort('timestamp -1').exec(function(error, data){
    if (error) {
      callback(error);
    } else {
      callback(data);
    }
  });
}

MeasurementService.prototype.new = function(id, data, callback) {
  for (var prop in data) {
    if (typeof prop === 'undefined') {
      callback(prop + ' is undefined');
    }
  }
  var measurement = new this.measurementModel({
    sensorId: id,
    temperature: parseFloat(data['temperature']),
    humidity: parseFloat(data['humidity']),
    pressure: parseFloat(data['pressure']),
    timestamp: Date.now()
  });
  measurement.save(function(error) {
    if (error) {
      callback(error);
    } else {
      callback('success');
    }
  });
}

MeasurementService.prototype.destroy = function(id, callback) {
  this.measurementModel.findById(id).remove(function(error){
    if (error) {
      callback(error);
    } else {
      callback('deleted');
    }
  });
}

module.exports = MeasurementService;