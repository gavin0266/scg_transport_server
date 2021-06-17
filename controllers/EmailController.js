const EmailService = require('../services/EmailService');

const { getAuth0AccessToken } = require('../security');

const axios = require('axios');


const engineerEmail = "gavin.kiwi@gmail.com";
const adminEmail = "scg.af.logistics@gmail.com"

const getRecipients = async (roles) => {
    const access = await getAuth0AccessToken();
    console.log(access);
    var recipients = [];
    
    var options = {
      method: 'GET',
      url: 'https://scg-transport.au.auth0.com/api/v2/users',
      params: {q: `app_metadata.roles: ${roles}`, search_engine: 'v3'},
      headers: {authorization: `Bearer ${access.access_token}`}
    };

    const response = await axios(options);
       
    response.data.forEach(user => {
        recipients.push(user.email);
    }); 

    return recipients;

        
}

module.exports = {
    addBooking: async (booking) => {
        // console.log(booking);
        const recipients = await getRecipients('admin');

        console.log(recipients);

        const url = process.env['FRONTEND'] + `/booking/${booking.bookingId}`;

        const subjects = `SCG-AF-LOGISTICS: ได้รับ ORDER ใหม่ - ORDER ${booking.bookingId}`

        const body = `<p>ได้รับ Order ใหม่ จาก <b>${booking.customer.name}</b></p> <p>ข้อมูลเพิ่มเติม: ${url}</p>`
 
        EmailService.sendEmail(recipients, subjects, body);
    },

    addLogistics: async (booking) => {
        // console.log(booking);
        const recipients = await getRecipients('engineer');

        console.log(recipients);

        const url = process.env['FRONTEND'] + `/booking/${booking.bookingId}`;

        const approveUrl = process.env['FRONTEND'] + `/booking/${booking.bookingId}/approve`;

        const subjects = `SCG-AF-LOGISTICS: ORDER #${booking.bookingId} - รายละเอียดการขนส่ง`

        const body = `<div>
                            Order #${booking.bookingId} ได้รับรายละเอียดการขนส่ง <br /><br />

                            <a href="${approveUrl}/1">อนุมัติ</a> | <a href="${approveUrl}/0">ปฏิเสธ</a>

                            <br /><br />

                            บริษัทขนส่ง: ${booking.logistic.logisticProvider.name}<br />
                            ที่รับสินค้า: ${booking.logistic.location}<br />
                            ชนิดรถขนส่ง: ${booking.logistic.vehicleType}<br />
                            ค่าขนส่ง (บาท): ${booking.logistic.price}<br />
                            นน.สุทธิโดยประมาณ (ตัน): ${booking.logistic.estimatedAmount}<br /> 
                            <br /> 
                            ข้อมูลเพิ่มเติม: ${url}
                     </div>`

        EmailService.sendEmail(recipients, subjects, body);
    },

    isApproved: async (booking) => {
        const recipients = [booking.addedBy.order.email, booking.addedBy.order.logistics];

        console.log(recipients);

        const url = process.env['FRONTEND'] + `/booking/${booking.bookingId}`;

        const approveUrl = process.env['FRONTEND'] + `/booking/${booking.bookingId}/approve`;

        const approveText = booking.status == "Approved" ? "อนุมัติ" : "ปฏิเสธ";

        const subjects = `SCG-AF-LOGISTICS: ORDER #${booking.bookingId} -  ได้รับการ${approveText}`

        const body = `<div>Order #${booking.bookingId} ได้รับการ${approveText} <br /> ข้อมูลเพิ่มเติม: ${url}</div>`

        EmailService.sendEmail(recipients, subjects, body);
    },

    isCompleted: async (booking) => {
        var recipients = [booking.addedBy.order.email, booking.addedBy.order.logistics];

        const engineerEmails = await getRecipients('engineer');

        recipients = [...recipients, ...engineerEmails];

        console.log(recipients);

        const url = process.env['FRONTEND'] + `/booking/${booking.bookingId}`;

        const approveUrl = process.env['FRONTEND'] + `/booking/${booking.bookingId}/approve`;

        const approveText = booking.status == "Approved" ? "อนุมัติ" : "ปฏิเสธ";

        const subjects = `SCG-AF-LOGISTICS: ORDER #${booking.bookingId} -  COMPLETED`

        const body = `<div>Order #${booking.bookingId} ได้รับการปิดงาน <br /> ข้อมูลเพิ่มเติม: ${url}</div>`

        EmailService.sendEmail(recipients, subjects, body);
    }
}