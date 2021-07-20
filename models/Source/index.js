const mongoose = require('mongoose');
const MongooseSequence = require('mongoose-sequence')(mongoose);

const { Schema } = mongoose;

const sourceSchema = require('./schema');

module.exports = Source = mongoose.model('Source', sourceSchema);