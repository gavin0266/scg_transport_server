const mongoose = require('mongoose');
const MongooseSequence = require('mongoose-sequence')(mongoose);

const { Schema } = mongoose;

const customerSchema = require('./schema');

module.exports = Customer = mongoose.model('Customer', customerSchema);