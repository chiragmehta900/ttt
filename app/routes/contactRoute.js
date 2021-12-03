const express = require('express')
const ContactController = require('../controller/contactController')


let setRouter = (app) => {
    //create contact
    app.post('/contact', ContactController.contactForm);
}


module.exports = {
    setRouter: setRouter
}