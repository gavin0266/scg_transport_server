const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    secureConnection: false, // TLS requires secureConnection to be false
    auth: {
        user: process.env['SENDINBLUE_USER'],
        pass: process.env['SENDINBLUE_PASS']
    },
    tls: {
        ciphers:'SSLv3'
    }
});


module.exports = {
    sendEmail: async (recipients, subject, body) => {

        if(process.env["SEND_NOTIFICATION"] != "true") return;

        let mailOptions = {
            from: '"SCG-AF-LOGISTICS" <admin@scg-af-logistic.cf>', // sender address (who sends)
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