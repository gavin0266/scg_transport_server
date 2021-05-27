
const mongoose = require('mongoose');
const MongooseSequence = require('mongoose-sequence')(mongoose);

const timeZone = require('mongoose-timezone');

const { Schema } = mongoose;

const customerSchema = require('../Customer/schema');

const logisticsSchema = require('../Logistic/schema');

const scaleSchema = require('../Scale/schema');
const Scale = require('../Scale');


const bookingSchema = new Schema({
    bookingId: {
        type: Number,
        index: true,
    },
    customer: {
        type: customerSchema,
        required: true,
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
    source: {
        type: String,
        default: () => null,
        required: false,
    },
    logistic: {
        type: logisticsSchema,
        required: false,
    },
    tickets: {
        type: [scaleSchema],
        required: false,
    },
    completedAt: {
        type: Date,
        required: false,
    }

}, { timestamps: true, toJSON: {getters: true}, toObject: {getters: true} })

bookingSchema.plugin(MongooseSequence, {inc_field: 'bookingId'});
bookingSchema.plugin(timeZone, { paths: ['completedAt'] });



module.exports = Booking = mongoose.model('Booking', bookingSchema);