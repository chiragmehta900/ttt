const express = require('express')
const ClientController = require('../controller/clientController')


let setRouter = (app) => {
    //create client
    app.post('/client', ClientController.createClient);  //work

    //view all client
    app.get('/client/all', ClientController.getAllClient); // work

    // view by ID
    app.get('/client/:clientId', ClientController.viewByClientId); // work

    // edit client
    app.put('/client/edit/:clientId', ClientController.editClient); // work

    // delete client
    app.put('/client/delete/:clientId', ClientController.deleteClient); // work
}


module.exports = {
    setRouter: setRouter
}