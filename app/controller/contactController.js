const express = require('express')
const mongoose = require('mongoose');
const shortid = require('shortid');
const response = require('../libs/responseLib');
const creds = require("../../config/credentail");
const nodemailer = require("nodemailer");
const ContactModel = mongoose.model('contactForm')


// Create Contact
let contactForm = (req, res) => {

    let contactId = shortid.generate()
    let contactName = req.body.contactName
    let contactSubject = req.body.contactSubject
    let contactPhoneNumber = req.body.contactPhoneNumber
    let contactMessage = req.body.contactMessage

    const newClient = new ContactModel({
        contactId: contactId,
        contactName: contactName,
        contactSubject: contactSubject,
        contactPhoneNumber: contactPhoneNumber,
        contactMessage: contactMessage
    })

    newClient.save((err, result) => {
        if (err) {
            let apiResponse = response.generate(true, 'No contact detail Found', 400, err)
            res.send(apiResponse)
        } else if (result == undefined || result == null || result == '') {
            let apiResponse = response.generate(true, 'No admin Found', 400, null)
            res.send(apiResponse)
        } else {
            var transport = {
                host: creds.SMTP,
                port: creds.PORT,
                auth: {
                    user: creds.USER,
                    pass: creds.PASS,
                },
            };
            var transporter = nodemailer.createTransport(transport);
            var mainOptions = {
                from: `"QWERTYVATE" somnium_nostri@snproweb.com`,
                to: 'chiragmehta900@gmail.com',
                subject: "Contat Form",
                text: 'Hello, qwertyvate someone just filled contact form on your website.\n\n' + 'Name: ' + contactName + '\n\n' + 'Subject: ' + contactSubject + '\n\n' + 'Phone Number: ' + contactPhoneNumber + '\n\n' + 'Message: ' + contactMessage + '\n'
            };

            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err.message);
                    res.json({
                        message: err.message,
                        success: false,
                    });
                } else {
                    res.json({
                        message: "Email Send Success",
                        success: true,
                    });
                }
            });
            let apiResponse = response.generate(false, 'Email Send update', 200, result)
            res.send(apiResponse)

        }
    })
}
// end create Contact


module.exports = {
    contactForm: contactForm
}