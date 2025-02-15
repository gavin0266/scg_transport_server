var express = require('express');
var { authenticated, checkRole, getUserEmail } = require('../security');

var router = express.Router();

const BookingController = require('../controllers/BookingController');

const EmailController = require('../controllers/EmailController');





/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/addBooking', authenticated, async (req, res, next) => {
    try {
        const { customerId, productType, bookingDate, transportDate, repeat, sourceId, location, vehicleType, link, fileURL, remarks } = req.body;
        
        const addedBy = {
            email: getUserEmail(req.user),
            userId: req.user.sub
        }

        const booking = await BookingController.addBooking(addedBy, customerId, productType, bookingDate, transportDate, repeat, sourceId, location, vehicleType, link, fileURL, remarks);

        EmailController.addBooking(booking);

        return res.status(200).json({status: '200 OK'});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.post('/booking/approve', authenticated, async (req, res, next) => {
    try {

        if(!checkRole(req.user, ['engineer'])) return res.sendStatus(401);

        const { bookingId, isApproved } = req.body;
        const result = await BookingController.approveBooking(bookingId, isApproved);

        EmailController.isApproved(result);

        return res.status(200).json({status: '200 OK'});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.get('/bookings', async (req, res, next) => {
    try {
        if(req.query.hasOwnProperty("startDate") && req.query.hasOwnProperty("endDate")) {
            const { startDate, endDate } = req.query;
            const result = await BookingController.getBookingsByTransportDate(startDate, endDate);

            return res.status(200).json(result);

        }


        const result = await BookingController.getAllBookings();

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.get('/booking/:id', authenticated, async (req, res, next) => {
    try {

        var bookingId = req.params.id;


        const result = await BookingController.getBookingById(bookingId);

        return res.status(200).json(result);


    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.post('/booking/logistic/add', authenticated, async (req, res, next) => {
    try {

        if(!checkRole(req.user, ['admin', 'engineer'])) return res.sendStatus(401);

        const addedBy = {
            email: getUserEmail(req.user),
            userId: req.user.sub
        }

        const { bookingId, logisticProviderId, location, vehicleType, price, estimatedAmount, transportDate } = req.body;
        const result = await BookingController.addLogisticToBooking(addedBy, bookingId, logisticProviderId, location, vehicleType, price, estimatedAmount, transportDate);

        // EmailController.addLogistics(result);

        return res.status(200).json({status: '200 OK'});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.post('/booking/scale/add', authenticated, async (req, res, next) => {
    try {

        if(!checkRole(req.user, ['admin', 'engineer'])) return res.sendStatus(401);

        const { bookingId, ticketIndex, receiptId, vehicleId, weight, image, transportDate } = req.body;
        const result = await BookingController.addScaleToBooking(bookingId, ticketIndex, receiptId, vehicleId, weight, image, transportDate);

        if (result.status == "Completed") {
            EmailController.isCompleted(result);
        }

        return res.status(200).json({status: '200 OK'});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});


router.post('/addProduct', async (req, res, next) => {
    try {
        const { productName } = req.body;
        const result = await BookingController.addProduct(productName);

        return res.status(200).json({status: '200 OK'});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.get('/products', async (req, res, next) => {
    try {
        const result = await BookingController.getAllProducts();

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});


router.post('/addLogistic', async (req, res, next) => {
    try {
        const { logisticName, location, vehicleType, price, estimatedAmount } = req.body;
        const result = await BookingController.addLogistic(logisticName, location, vehicleType, price, estimatedAmount);

        return res.status(200).json({status: '200 OK'});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.post('/logistic/provider/add', authenticated, async (req, res, next) => {
    try {
        const { name } = req.body;
        const result = await BookingController.addLogisticProvider(name);

        return res.status(200).json({status: '200 OK'});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.post('/source/add', authenticated, async (req, res, next) => {
    try {
        const { name } = req.body;
        const result = await BookingController.addSource(name);

        return res.status(200).json({status: '200 OK'});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.post('/source/modifyAll', async (req, res, next) => {
    try {
        const result = await BookingController.updateSourceInBookings();

        return res.status(200).json({status: '200 OK'});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.get('/sources', async (req, res, next) => {
    try {
        const result = await BookingController.getAllSources();

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.get('/logistic/providers', async (req, res, next) => {
    try {
        const result = await BookingController.getAllLogisticProviders();

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.post('/customer/add', authenticated, async (req, res, next) => {
    try {
        const { name } = req.body;
        const result = await BookingController.addCustomer(name);

        return res.status(200).json({status: '200 OK'});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.get('/customers', async (req, res, next) => {
    try {
        const result = await BookingController.getAllCustomers();

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.get('/booking/:id/tickets', async (req, res, next) => {
    try {
        var bookingId = req.params.id;
        const result = await BookingController.getBookingTicketsById(bookingId);

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.get('/analytics/:year/:month', async (req, res, next) => {
    try {
        var { year, month } = req.params;

        const result = await BookingController.getNewAnalyticsData(parseInt(year), parseInt(month) - 1);
        return res.status(200).json(result);

    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

module.exports = router;
