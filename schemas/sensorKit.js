var mongoose = require('mongoose');

var sensorKitSchema = new mongoose.Schema({
  name: String,
  location: { type: String, required: true }
});

var SensorKit = mongoose.model('SensorKit', sensorKitSchema);

module.exports = SensorKit;