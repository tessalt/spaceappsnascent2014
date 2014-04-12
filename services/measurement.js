var MeasurementService = function(measurementModel) {
  this.measurementModel = measurementModel;
}

MeasurementService.prototype.index = function(id, callback) {
  this.measurementModel.find(function(error, results){
    if (error) {
      callback(error);
    } else {
      callback(results);
    }
  });
}

MeasurementService.prototype.new = function(id, data, callback) {
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
};

exports.MeasurementService = MeasurementService;