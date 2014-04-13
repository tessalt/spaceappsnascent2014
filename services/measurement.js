var MeasurementService = function(measurementModel) {
  this.measurementModel = measurementModel;
}

MeasurementService.prototype.index = function(id, query, callback) {
  var search = {};
  if (id) {
    search.sensorId = id;
  }
  if (query.from && query.to) {
    search.timestamp = {
      $gte: new Date(query.from),
      $lt: new Date(query.to)
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
    temperature: data.temperature,
    humidity: data.humidity,
    pressure: data.pressure,
    timestamp: data.timestamp || Date.now()
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