const endOfDay = require('date-fns/endOfDay');
const startOfDay = require('date-fns/startOfDay');

const Booking = require('../models/Booking');
const Product = require('../models/Product');
const Logistic = require('../models/Logistic');
const LogisticProvider = require('../models/LogisticProvider');
const Customer = require('../models/Customer');
const Scale = require('../models/Scale');

const { zonedTimeToUtc } = require('date-fns-tz');



module.exports = {
    addBooking: async (addedBy, customerId, productType, bookingDate, transportDate, repeat, tickets, source, link, fileURL, remarks, logistic) => {

        const customer = await Customer.findOne( { customerId: customerId } ) 

        const booking = new Booking({
            customer: customer,
            productType: productType,
            bookingDate: bookingDate,
            transportDate: transportDate,
            repeat: repeat,
            tickets: tickets,
            source: source,
            link: link,
            fileURL: fileURL,
            remarks: remarks,
            logistic: logistic,
            addedBy: { order: addedBy, logistics: null, tickets: null },
        })

        return await booking.save();
    },

    getAllBookings: async () => {
        var query = Booking.find();
        return query;
    },

    getBookingsByTransportDate: async (startDate, endDate) => {

        

        var query = Booking.find(
            { 
                transportDate: {
                    $gte: startOfDay(new Date(startDate)),
                    $lte: endOfDay(new Date(endDate))
                } 
            }
        );
        
        return query;
    },

    getBookingsByCompletedDate: async (startDate, endDate) => {

        var query = Booking.find(
            { 
                completedAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                } 
            }
        );
        return query;
    },



    getBookingById: async (id) => {
        var query = Booking.findOne({ bookingId: id });
        return query
    },

    changeBookingStatus: async (bookingId, status) => {

        var booking = await Booking.findOne({ bookingId: bookingId });

        booking.status = status;

        return await booking.save();
    },

    addProduct: async (productName) => {
        const product = new Product({ productName: productName });

        return await product.save();
    },

    getAllProducts: async () => {
        var query = Product.find();
        return query.lean().exec();
    },

    addLogistic: async (logisticName, location, vehicleType, price, estimatedAmount) => {
        const logistic = new Logistic({
            logisticName,
            location,
            vehicleType,
            price,
            estimatedAmount,
        })

        return await logistic.save();
    },

    addLogisticToBooking: async (addedBy, bookingId, logisticProviderId, location, vehicleType, price, estimatedAmount) => {
        const booking = await Booking.findOne( { bookingId: bookingId });
        const logisticProvider = await LogisticProvider.findOne( { providerId: logisticProviderId } )

        const logistic = {
            logisticProvider: logisticProvider,
            location: location,
            vehicleType: vehicleType,
            price:price,
            estimatedAmount: estimatedAmount,
        };

        console.log(logistic);
        booking.logistic = logistic;
        booking.status = 'Submitted';
        booking.addedBy.logistics = addedBy;

        return await booking.save();
    },

    addLogisticProvider: async (name) => {
        const logisticProvider = new LogisticProvider({ name: name })

        return await logisticProvider.save();
    },

    getAllLogisticProviders: async () => {
        var query = LogisticProvider.find();
        return query.lean().exec();
    },

    addCustomer: async (name) => {
        const customer = new Customer({ name: name })

        return await customer.save();
    },

    getAllCustomers: async () => {
        var query = Customer.find();
        return query;
    },

    addScaleToBooking: async (bookingId, ticketIndex, receiptId, vehicleId, weight, image) => {
        const booking = await Booking.findOne( { bookingId: bookingId });
        const ticket = {
            receiptId, vehicleId, weight, image, filled: true,
        };

        booking.tickets[ticketIndex] = ticket;

        const completed = booking.tickets.every(item => item.weight > 0);

        if (completed) {
            booking.status = 'Completed';
            booking.completedAt = new Date();
        }

        return await booking.save();
    },

    getBookingTicketsById: async (id) => {
        var query = await Booking.findOne({ bookingId: id });
        return query.tickets;
    },
}