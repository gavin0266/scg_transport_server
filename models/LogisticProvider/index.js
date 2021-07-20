const mongoose = require('mongoose');
const MongooseSequence = require('mongoose-sequence')(mongoose);

const { Schema } = mongoose;

const logisticProviderSchema = require('./schema');

module.exports = LogisticProvider = mongoose.model('LogisticProvider', logisticProviderSchema);