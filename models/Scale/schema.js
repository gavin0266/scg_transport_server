const mongoose = require('mongoose');
const MongooseSequence = require('mongoose-sequence')(mongoose);

const { Schema } = mongoose;

const scaleSchema = new Schema({
    receiptId: {
        type: String,
    },
    vehicleId: {
        type: String,
    },
    weight: {
        type: Number,
        required: true,
        set: num => num * 100,
        get: num => (num / 100).toFixed(2)
    },
    image: {
        type: String,
    }
}, { timestamps: true, toJSON: {getters: true}, toObject: {getters: true} })

module.exports = scaleSchema;