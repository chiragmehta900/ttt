const express = require('express')
const mongoose = require('mongoose');
const shortid = require('shortid');
const response = require('../libs/responseLib');
const ClientModel = mongoose.model('client')


// Create client
let createClient = async (req, res) => {
    try {
        let clientId = shortid.generate()
        let clientName = req.body.clientName
        let clientLogo = req.body.clientLogo

        const newClient = new ClientModel({
            clientId: clientId,
            clientName: clientName,
            clientLogo: clientLogo
        })

        newClient.save((err, result) => {
            if (err) {
                let apiResponse = response.generate(true, 'no client detail found.', 400, err)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'client detail added successful.', 200, result)
                res.send(apiResponse)
            }
        })
    } catch (error) {
        let apiResponse = response.generate(true, '', 500, error.message)
        return res.send(apiResponse)
    }
}
// end create client


// view all client
let getAllClient = (req, res) => {
    ClientModel.find()
        .select('-__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                let apiResponse = response.generate(true, 'no client detail found.', 400, err)
                res.send(apiResponse)
            } else if (result == undefined || result == null || result == '') {
                res.send("No client found.")
            } else {
                let apiResponse = response.generate(false, 'all client display successful.', 200, result)
                res.send(apiResponse)
            }
        })
}
// end view client


// client view by ID
let viewByClientId = (req, res) => {

    ClientModel.findOne({ 'clientId': req.params.clientId }, (err, result) => {

        if (err) {
            let apiResponse = response.generate(true, 'error', 400, err)
            res.send(apiResponse);
        } else if (result == undefined || result == null || result == '') {
            let apiResponse = response.generate(true, 'no client found.', 400, null)
            res.send(apiResponse);
        } else {
            let apiResponse = response.generate(false, 'client view successful.', 200, result)
            res.send(apiResponse);
        }
    })
}
// end client view by ID


// edit client
let editClient = async (req, res) => {
    try {
        if (req.params.clientId === null) {
            res.status(404).send("client Not Found")
        } else {
            let options = req.body;

            ClientModel.update({ 'clientId': req.params.clientId }, options, { multi: true }).exec((err, result) => {

                if (err) {
                    console.log(err)
                    res.send(err)
                } else if (result == undefined || result == null || result == '') {
                    res.send("client not found.")
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
// end edit client


// delete client
let deleteClient = async (req, res) => {
    try {
        let isActive = req.body.isActive;
        ClientModel.findOneAndUpdate({ 'clientId': req.params.clientId }, { $set: { isActive: false } }).exec((err, result) => {
            if (err) {
                let apiResponse = response.generate(true, 'error', 400, err)
                res.send(apiResponse);
            } else if (result == undefined || result == null || result == '') {
                let apiResponse = response.generate(true, 'no client found.', 400, null)
                res.send(apiResponse);
            } else {
                let apiResponse = response.generate(false, 'client delete successful.', 200, result)
                res.send(apiResponse);
            }
        })
    } catch (error) {
        let apiResponse = response.generate(true, '', 500, error.message)
        return res.send(apiResponse)
    }
}
// end delete client



module.exports = {
    createClient: createClient,
    getAllClient: getAllClient,
    viewByClientId: viewByClientId,
    editClient: editClient,
    deleteClient: deleteClient
}