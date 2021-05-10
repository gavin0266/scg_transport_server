const BookingService = require('../services/BookingService');

const { parse } = require('date-fns');


module.exports = {
    addBooking: async (orgName, productType, bookingDate, transportDate, repeat) => {

        var bookingDateObj = parse(bookingDate, 'dd/MM/yyyy', new Date());
        var transportDateObj = parse(transportDate, 'dd/MM/yyyy', new Date());

        return BookingService.addBooking(orgName, productType, bookingDateObj, transportDateObj, repeat);
    },

    approveBooking: async (bookingId, isApprove) => {

        if(isApprove){
            return BookingService.changeBookingStatus(bookingId, 'Approved');
        } else {
            return BookingService.changeBookingStatus(bookingId, 'Rejected');
        }

    },

    getAllBookings: async () => {
        return BookingService.getAllBookings();
    },

    getBookingById: async (id) => {
        return BookingService.getBookingById(id);
    },

    addProduct: async (productName) => {
        return BookingService.addProduct(productName);
    },

    getAllProducts: async () => {
        return BookingService.getAllProducts();
    },

    addLogistic: async (logisticName, location, vehicleType, price, estimatedAmount) => {
        return BookingService.addLogistic(logisticName, location, vehicleType, price, estimatedAmount);
    },
    addLogisticToBooking: async (bookingId, logisticProviderId, location, vehicleType, price, estimatedAmount) => {
        return BookingService.addLogisticToBooking(bookingId, logisticProviderId, location, vehicleType, price, estimatedAmount);
    },
    addLogisticProvider: async (name) => {
        return BookingService.addLogisticProvider(name);
    },
    getAllLogisticProviders: async () => {
        return BookingService.getAllLogisticProviders();
    },
    addScaleToBooking: async (bookingId, receiptId, vehicleId, weight, image) => {
        return BookingService.addScaleToBooking(bookingId, receiptId, vehicleId, weight, image);
    },

}