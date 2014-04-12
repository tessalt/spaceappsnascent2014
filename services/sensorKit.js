var SensorKitService = function(sensorKitModel) {
  this.sensorKitModel = sensorKitModel;
}

SensorKitService.prototype.index = function(callback) {
  this.sensorKitModel.find(function(error, results){
    if (error) {
      console.log('error');
    } else {
      callback(results);
    }
  });
};

SensorKitService.prototype.new = function(id, location, callback) {
  var sk = new this.sensorKitModel({
    id: id,
    location: location
  });
  sk.save(function(error){
    if (error) {
      callback(error);
    } else {
      callback('success');
    }
  });
};

exports.SensorKitService = SensorKitService;

