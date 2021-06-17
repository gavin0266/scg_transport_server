const mongoose = require('mongoose');
const MongooseSequence = require('mongoose-sequence')(mongoose);

const { Schema } = mongoose;

const logisticProviderSchema = require("../LogisticProvider/schema");

const logisticsSchema = new Schema({
    logisticProvider: {
        type: logisticProviderSchema,
        required: false,
        default: () => null,
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
        required: false,
        set: num => num * 100,
        get: num => (num / 100).toFixed(2),
        default: () => null,

    },
    estimatedAmount: {
        type: Number,
        required: false,
        set: num => num * 100,
        get: num => (num / 100).toFixed(2),
        default: () => null,

    }
}, { timestamps: true, toJSON: {getters: true}, toObject: {getters: true} })


module.exports = logisticsSchema;