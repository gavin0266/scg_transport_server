const mongoose = require('mongoose');
const MongooseSequence = require('mongoose-sequence')(mongoose);

const { Schema } = mongoose;

const logisticsSchema = require('./schema');

module.exports = Logistic = mongoose.model('Logistic', logisticsSchema);