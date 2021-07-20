const mongoose = require('mongoose');
const MongooseSequence = require('mongoose-sequence')(mongoose);

const { Schema } = mongoose;

const sourceSchema = new Schema({
    sourceId: {
        type: Number,
        index: true,
    },
    name: {
        type: String,
        required: true,
    }
})

sourceSchema.plugin(MongooseSequence, {inc_field: 'sourceId'});

module.exports = sourceSchema;