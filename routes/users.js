var express = require('express');
var stream = require('stream');

var router = express.Router();

var { authenticated, checkRole } = require('../security');

var xl = require('excel4node');

const ExcelController = require('../controllers/ExcelController');


/* GET users listing. */
router.get('/orders', async (req, res, next) => {
  // if(!checkRole(req.user, ['engineer'])) return res.sendStatus(401);
  try {
        console.log(req.query);
        const { startDate, endDate } = req.query;    

        var wb = new xl.Workbook({
            dateFormat: 'dd/mm/yy'
        });

        await ExcelController.createOrders(wb, startDate, endDate);

        // wb.write('Excel.xlsx', res);
        wb.writeToBuffer().then((buffer) => {
            var readStream = new stream.PassThrough();
            readStream.end(buffer);

            res.set('Content-disposition', 'attachment; filename=' + 'Excel.xlsx');
            res.set('Content-Type', 'blob');
            readStream.pipe(res);
            // res.write(buffer);
        })

        // return res.status(200).json({status: '200 OK'});
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
});


module.exports = router;
