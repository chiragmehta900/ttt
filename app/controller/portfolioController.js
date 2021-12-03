const express = require('express')
const mongoose = require('mongoose');
const shortid = require('shortid');
const response = require('../libs/responseLib');
const PortfolioModel = mongoose.model('portfolio')


// Create portfolio
let createPortfolio = async (req, res) => {
    try {
        let portfolioId = shortid.generate()
        let portfolioTitle = req.body.portfolioTitle
        let portfolioDescription = req.body.portfolioDescription
        let portfolioImage = req.body.portfolioImage
        let portfolioType = req.body.portfolioType

        const newportfolio = new PortfolioModel({
            portfolioId: portfolioId,
            portfolioTitle: portfolioTitle,
            portfolioDescription: portfolioDescription,
            portfolioImage: portfolioImage,
            portfolioType: portfolioType
        })

        newportfolio.save((err, result) => {
            if (err) {
                let apiResponse = response.generate(true, 'No portfolio detail found.', 400, err)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'portfolio detail added successful.', 200, result)
                res.send(apiResponse)
            }
        })
    } catch (error) {
        let apiResponse = response.generate(true, '', 500, error.message)
        return res.send(apiResponse)
    }
}
// end create portfolio


// view all portfolio
let getAllPortfolio = (req, res) => {
    PortfolioModel.find()
        .select('-__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                let apiResponse = response.generate(true, 'No portfolio detail found.', 400, err)
                res.send(apiResponse)
            } else if (result == undefined || result == null || result == '') {
                res.send("No portfolio found.")
            } else {
                let apiResponse = response.generate(false, 'all portfolio display successful.', 200, result)
                res.send(apiResponse)
            }
        })
}
// end view portfolio


// portfolio view by ID
let viewByPortfolioId = (req, res) => {

    PortfolioModel.findOne({ 'portfolioId': req.params.portfolioId }, (err, result) => {

        if (err) {
            let apiResponse = response.generate(true, 'error', 400, err)
            res.send(apiResponse);
        } else if (result == undefined || result == null || result == '') {
            let apiResponse = response.generate(true, 'no portfolio found.', 400, null)
            res.send(apiResponse);
        } else {
            let apiResponse = response.generate(false, 'portfolio display successful.', 200, result)
            res.send(apiResponse);
        }
    })
}
// end portfolio view by ID


// edit portfolio
let editPortfolio = async (req, res) => {
    try {
        if (req.params.portfolioId === null) {
            res.status(404).send("portfolio Not Found")
        } else {
            let options = req.body;

            PortfolioModel.update({ 'portfolioId': req.params.portfolioId }, options, { multi: true }).exec((err, result) => {

                if (err) {
                    console.log(err)
                    res.send(err)
                } else if (result == undefined || result == null || result == '') {
                    res.send("portfolio not found.")
                } else {
                    res.send(result)
                }
            })
        }
    } catch (error) {
        let apiResponse = response.generate(true, '', 500, error.message)
        return res.send(apiResponse)
    }
}
// end edit portfolio


// delete portfolio
let deletePortfolio = async (req, res) => {
    try {
        let isActive = req.body.isActive;
        PortfolioModel.findOneAndUpdate({ 'portfolioId': req.params.portfolioId }, { $set: { isActive: false } }).exec((err, result) => {
            if (err) {
                let apiResponse = response.generate(true, 'error', 400, err)
                res.send(apiResponse);
            } else if (result == undefined || result == null || result == '') {
                let apiResponse = response.generate(true, 'portfolio not found.', 400, null)
                res.send(apiResponse);
            } else {
                let apiResponse = response.generate(false, 'portfolio delete successful.', 200, result)
                res.send(apiResponse);
            }
        })
    } catch (error) {
        let apiResponse = response.generate(true, '', 500, error.message)
        return res.send(apiResponse)
    }

}
// end delete portfolio



module.exports = {
    createPortfolio: createPortfolio,
    getAllPortfolio: getAllPortfolio,
    viewByPortfolioId: viewByPortfolioId,
    editPortfolio: editPortfolio,
    deletePortfolio: deletePortfolio
}