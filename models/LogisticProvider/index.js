const mongoose = require('mongoose');
const MongooseSequence = require('mongoose-sequence')(mongoose);

const { Schema } = mongoose;

const logisticProviderSchema = require('./schema');

module.exports = Logistic = mongoose.model('LogisticProvider', logisticProviderSchema);