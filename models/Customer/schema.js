const mongoose = require('mongoose');
const MongooseSequence = require('mongoose-sequence')(mongoose);

const { Schema } = mongoose;

const customerSchema = new Schema({
    customerId: {
        type: Number,
        index: true,
    },
    name: {
        type: String,
        required: true,
    }
})

customerSchema.plugin(MongooseSequence, {inc_field: 'customerId'});

module.exports = customerSchema;