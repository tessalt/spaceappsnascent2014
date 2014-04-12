var MeasurementService = function(measurementModel) {
  this.measurementModel = measurementModel;
}

MeasurementService.prototype.all = function(callback) {
  this.measurementModel.find(function(error, data){
    if (error) {
      callback(error);
    } else {
      callback(data);
    }
  });
}

MeasurementService.prototype.index = function(id, query, callback) {
  if (query.from) {
    var startDate = new Date(query.from);
    var endDate = new Date(query.to);
    this.measurementModel.find({sensorId: id, timestamp: { $gte: startDate, $lt: endDate } }, function(error, results){
      console.log(query);
      if (error) {
        callback(error);
      } else {
        callback(results);
      }
    });
  } else {
    this.measurementModel.find({ sensorId: id }, function(error, results){
      console.log(query);
      if (error) {
        callback(error);
      } else {
        callback(results);
      }
    });
  }
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
    timestamp: data.timestamp
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

exports.MeasurementService = MeasurementService;