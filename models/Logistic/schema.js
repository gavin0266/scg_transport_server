const mongoose = require('mongoose');
const MongooseSequence = require('mongoose-sequence')(mongoose);

const { Schema } = mongoose;

const logisticProviderSchema = require("../LogisticProvider/schema");

const logisticsSchema = new Schema({
    logisticProvider: {
        type: logisticProviderSchema,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    vehicleType: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        set: num => num * 100,
        get: num => (num / 100).toFixed(2)
    },
    estimatedAmount: {
        type: Number,
        required: true,
        set: num => num * 100,
        get: num => (num / 100).toFixed(2)
    }
}, { timestamps: true, toJSON: {getters: true}, toObject: {getters: true} })


module.exports = logisticsSchema;