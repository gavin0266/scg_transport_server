var express = require('express');
var router = express.Router();

const BookingController = require('../controllers/BookingController');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/addBooking', async (req, res, next) => {
    try {
        const { orgName, bookingDate, transportDate, repeat } = req.body;
        const result = await BookingController.addBooking(orgName, bookingDate, transportDate, repeat);

        return res.status(200).json({status: '200 OK'});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

router.get('/bookings', async (req, res, next) => {
    try {
        const result = await BookingController.getAllBookings();

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

module.exports = router;
