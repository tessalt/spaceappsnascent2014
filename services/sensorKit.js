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

exports.SensorKitService = SensorKitService;

