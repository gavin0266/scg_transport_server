const Booking = require('../models/Booking');
const Product = require('../models/Product');
const Logistic = require('../models/Logistic');
const LogisticProvider = require('../models/LogisticProvider');
const Scale = require('../models/Scale');



module.exports = {
    addBooking: async (orgName, productType, bookingDate, transportDate, repeat) => {
        const booking = new Booking({
            orgName: orgName,
            productType: productType,
            bookingDate: bookingDate,
            transportDate: transportDate,
            repeat: repeat,
        })

        return await booking.save();
    },

    getAllBookings: async () => {
        var query = Booking.find();
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

    addLogisticToBooking: async (bookingId, logisticProviderId, location, vehicleType, price, estimatedAmount) => {
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

    addScaleToBooking: async (bookingId, receiptId, vehicleId, weight, image) => {
        const booking = await Booking.findOne( { bookingId: bookingId });
        const scale = {
            bookingId, receiptId, vehicleId, weight, image
        };

        console.log(scale);
        booking.scale = scale;
        booking.status = 'Completed';

        return await booking.save();
    },
}