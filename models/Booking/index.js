
const mongoose = require('mongoose');
const MongooseSequence = require('mongoose-sequence')(mongoose);

const timeZone = require('mongoose-timezone');

const { Schema } = mongoose;

const customerSchema = require('../Customer/schema');

const logisticsSchema = require('../Logistic/schema');

const scaleSchema = require('../Scale/schema');

const sourceSchema = require('../Source/schema');

const Scale = require('../Scale');

const userSchema = new Schema({
    email: {
        type: String,
    },
    userId: {
        type: String,
    }
})


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
        type: Object,
        default: () => null,
        required: false,
    },
    link: {
        type: String,
        required: false,
        default: () => null,
    },
    fileURL: {
        type: String,
        required: false,
        default: () => null,
    },
    remarks: {
        type: String,
        required: false,
        maxLength: 255,
        default: () => null,
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
    },

    addedBy: {
        order: { type: userSchema },
        logistics: { type: userSchema },
        tickets: { type: userSchema },
    }

}, { timestamps: true, toJSON: {getters: true}, toObject: {getters: true} })

bookingSchema.plugin(MongooseSequence, {inc_field: 'bookingId'});
bookingSchema.plugin(timeZone, { paths: ['completedAt'] });



module.exports = Booking = mongoose.model('Booking', bookingSchema);