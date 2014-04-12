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

SensorKitService.prototype.new = function(name, location, callback) {
  if (name.length > 0 && location.length > 0) {
    var sk = new this.sensorKitModel({
      name: name,
      location: location
    });
    sk.save(function(error){
      if (error) {
        callback(error);
      } else {
        callback('success');
      }
    });
  } else {
    callback('include name and location');
  }
};

SensorKitService.prototype.show = function(id, callback) {
  this.sensorKitModel.findById(id, function(error, result){
    if (error) {
      callback(error);
    } else {
      callback(result);
    }
  });
};

SensorKitService.prototype.destroy = function(id, callback) {
  this.sensorKitModel.findById(id).remove(function(error){
    if (error) {
      callback(error);
    } else {
      callback('deleted');
    }
  });
};

SensorKitService.prototype.update = function(id, name, location, callback) {
  this.sensorKitModel.findByIdAndUpdate(id, {name: name, location: location}, function(error){
    if (error) {
      callback(error);
    } else {
      callback('updated');
    }
  });
};

exports.SensorKitService = SensorKitService;

