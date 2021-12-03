const express = require('express')
const adminLoginController = require('../controller/adminLoginController')


let setRouter = (app) => {
    let baseUrl = '/admin';
    // admin password generate
    app.post(baseUrl + '/password/generate', adminLoginController.adminPasswordGenerate); // work
    
    // admin login
    app.post(baseUrl + '/login', adminLoginController.adminlogin); //work

}

module.exports = {
    setRouter: setRouter
}