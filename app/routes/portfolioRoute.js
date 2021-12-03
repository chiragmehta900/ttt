const express = require('express')
const PortfolioCrontroller = require('../controller/portfolioController')


let setRouter = (app) => {
    //create portfolio
    app.post('/portfolio', PortfolioCrontroller.createPortfolio);  //work

    //view all portfolio
    app.get('/portfolio/all', PortfolioCrontroller.getAllPortfolio); // work

    // view by ID
    app.get('/portfolio/:portfolioId', PortfolioCrontroller.viewByPortfolioId); // work

    // edit portfolio
    app.put('/portfolio/edit/:portfolioId', PortfolioCrontroller.editPortfolio); // work

    // delete portfolio
    app.put('/portfolio/delete/:portfolioId', PortfolioCrontroller.deletePortfolio); // work
}


module.exports = {
    setRouter: setRouter
}