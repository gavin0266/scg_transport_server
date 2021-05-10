const mongoose = require('mongoose');
const MongooseSequence = require('mongoose-sequence')(mongoose);

const { Schema } = mongoose;

const logisticProviderSchema = new Schema({
    providerId: {
        type: Number,
        index: true,
    },
    name: {
        type: String,
        required: true,
        unique: true
    }
})

logisticProviderSchema.plugin(MongooseSequence, {inc_field: 'providerId'});

module.exports = logisticProviderSchema;