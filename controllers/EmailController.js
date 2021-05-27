const EmailService = require('../services/EmailService');

const engineerEmail = "gavin.kiwi@gmail.com";
const adminEmail = "scg.af.logistics@gmail.com"

module.exports = {
    addBooking: async (booking) => {
        console.log(booking);
        const url = process.env['FRONTEND'] + `/booking/${booking.bookingId}`;

        const subject = `SCG-AF-LOGISTICS: NEW ORDER ${booking.bookingId}`

        const body = `<p>ได้รับ Order ใหม่ จาก <b>${booking.customer.name}</b></p> <p>ข้อมูลเพิ่มเติม: ${url}</p>`

        EmailService.sendEmail([engineerEmail, adminEmail], subject, body);
    },
}
