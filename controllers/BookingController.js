const BookingService = require('../services/BookingService');

const { parse } = require('date-fns');


module.exports = {
    addBooking: async (orgName, bookingDate, transportDate, repeat) => {

        var bookingDateObj = parse(bookingDate, 'dd/MM/yyyy', new Date());
        var transportDateObj = parse(transportDate, 'dd/MM/yyyy', new Date());

        return await BookingService.addBooking(orgName, bookingDateObj, transportDateObj, repeat);
    },

    getAllBookings: async () => {
        return BookingService.getAllBookings();
    }

}