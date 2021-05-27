const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, //ssl
    auth: {
        user: 'scg-af-logistics@fungtammasan.com',
        pass: 'Scg12345!'
    }
});


module.exports = {
    sendEmail: async (recipients, subject, body) => {

        if(process.env["SEND_NOTIFICATION"] != "true") return;

        let mailOptions = {
            from: '"SCG-AF-LOGISTICS" <scg-af-logistics@fungtammasan.com>', // sender address (who sends)
            to: recipients, // list of receivers (who receives)
            subject: subject, // Subject line
            html: body // html body
        };

        // send mail with defined transport object
        return new Promise(
            (resolve, reject) => {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error(`couldn't send mail ${error}`);
                        reject(error)
                    } else {
                        console.log('Message sent: ' + info.response);
                        resolve(info.response)
                    }
                });

            })

    }

}