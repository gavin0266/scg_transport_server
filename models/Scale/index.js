const mongoose = require('mongoose');
const MongooseSequence = require('mongoose-sequence')(mongoose);

const { Schema } = mongoose;

const scaleSchema = require('./schema');

module.exports = Scale = mongoose.model('Scale', scaleSchema);