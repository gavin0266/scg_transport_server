
const mongoose = require('mongoose');
const MongooseSequence = require('mongoose-sequence')(mongoose);

const { Schema } = mongoose;

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
}, { timestamps: true })

bookingSchema.plugin(MongooseSequence, {inc_field: 'bookingId'});

module.exports = Booking = mongoose.model('Booking', bookingSchema);