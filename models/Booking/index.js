
const mongoose = require('mongoose');
const MongooseSequence = require('mongoose-sequence')(mongoose);

const { Schema } = mongoose;

const logisticsSchema = require('../Logistic/schema');

const scaleSchema = require('../Scale/schema');

const bookingSchema = new Schema({
    bookingId: {
        type: Number,
        index: true,
    },
    orgName: {
        type: String,
        required: true,
        unique: true,
    },
    productType: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum : ['Pending', 'Submitted', 'Approved', 'Rejected', 'Completed'],
        default: 'Pending'
    },
    bookingDate: {
        type: Date,
        required: true,
    },
    transportDate: {
        type: Date,
        required: true,
    },
     repeat: {
        type: Number,
        default: () => 1,
        required: true
    },
    logistic: {
        type: logisticsSchema,
        required: false,
    },
    scale: {
        type: scaleSchema,
        required: false,
    },

}, { timestamps: true, toJSON: {getters: true}, toObject: {getters: true} })

bookingSchema.plugin(MongooseSequence, {inc_field: 'bookingId'});



module.exports = Booking = mongoose.model('Booking', bookingSchema);