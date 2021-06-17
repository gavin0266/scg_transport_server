const BookingService = require('../services/BookingService');
const EmailService = require('../services/EmailService');

const { parse } = require('date-fns');
const { zonedTimeToUtc } = require('date-fns-tz');


module.exports = {
    addBooking: async (addedBy, customerId, productType, bookingDate, transportDate, repeat, source, location, vehicleType, link, fileURL, remarks) => {

        const defaultTicket = () => ({
            receiptId: null,
            vehicleId: null,
            weight: null,
            image: null,
        })

        var bookingDateObj = parse(bookingDate, 'dd/MM/yyyy', new Date());
        var transportDateObj = parse(transportDate, 'dd/MM/yyyy', new Date());

        var tickets = [];

        for (var i = repeat - 1; i >= 0; i--) {
            tickets.push(defaultTicket());
        }

        const logistic = {
            location,
            vehicleType,
        }

        return BookingService.addBooking(addedBy, customerId, productType, bookingDateObj, transportDateObj, repeat, tickets, source, link, fileURL, remarks, logistic);
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

    getBookingsByTransportDate: async (startDate, endDate) => {
        return BookingService.getBookingsByTransportDate(startDate, endDate);
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
    addLogisticToBooking: async (addedBy, bookingId, logisticProviderId, location, vehicleType, price, estimatedAmount) => {
        return BookingService.addLogisticToBooking(addedBy, bookingId, logisticProviderId, location, vehicleType, price, estimatedAmount);
    },
    addLogisticProvider: async (name) => {
        return BookingService.addLogisticProvider(name);
    },
    getAllLogisticProviders: async () => {
        return BookingService.getAllLogisticProviders();
    },
    addCustomer: async (name) => {
        return BookingService.addCustomer(name);
    },
    getAllCustomers: async () => {
        return BookingService.getAllCustomers();
    },
    addScaleToBooking: async (bookingId, ticketIndex, receiptId, vehicleId, weight, image) => {
        return BookingService.addScaleToBooking(bookingId, ticketIndex, receiptId, vehicleId, weight, image);
    },
    getBookingTicketsById: async (id) => {
        return BookingService.getBookingTicketsById(id);
    },

}