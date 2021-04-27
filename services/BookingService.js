const Booking = require('../models/Booking');

module.exports = {
    addBooking: async (orgName, bookingDate, transportDate, repeat) => {
        const booking = new Booking({
            orgName: orgName,
            bookingDate: bookingDate,
            transportDate: transportDate,
            repeat: repeat,
        })

        return await booking.save();
    },

    getAllBookings: async () => {
        var query = Booking.find();
        return query.lean().exec();
    }
}