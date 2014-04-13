var mongoose = require('mongoose');

var measurementSchema = new mongoose.Schema({
  sensorId: [mongoose.Schema.Types.ObjectId],
  timestamp: { type: Date, default: Date.now },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  pressure: { type: Number, required: true }
});

var Measurement = mongoose.model('Measurement', measurementSchema);

module.exports = Measurement;