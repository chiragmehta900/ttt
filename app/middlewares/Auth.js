const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const request = require("request")
/* Models */
const Auth = mongoose.model('Auth')

/* Const Library */
const logger = require('../libs/loggerLib')
const responseLib = require('../libs/responseLib')
const check = require('../libs/checkLib')


let isAuthenticated = (req, res, next) => {
    console.log("token", req.params.authToken)
    if (req.params.authToken || req.query.authToken || req.body.authToken || req.header('authToken')) {
        Auth.findOne({ authToken: req.header('authToken') || req.params.authToken || req.body.authToken || req.query.authToken }, (err, authDetails) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Authentication Middleware', 10)
                let apiResponse = responseLib.generate(true, 'Failed To Authenticate', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(authDetails)) {
                logger.error('No Authentication Key Is Present', 'Authentication Middleware', 10)
                let apiResponse = responseLib.generate(true, 'Invalid Or Expired Authentication Key', 404, null)
                res.send(apiResponse)
            } else {
                jwt.verify(authDetails.authToken, authDetails.tokenSecret, (err, decoded) => {
                    if (err) {
                        if (err.name === 'TokenExpiredError') {
                            logger.error(err.message, 'Authorization Middleware', 10)
                            let apiResponse = responseLib.generate(true, 'Token Is Expired. Login Again to Generate New Token', 500, null)
                            res.send(apiResponse)
                        } else if (err.name === 'JsonWebTokenError') {
                            logger.error(err.message, 'Authorization Middleware', 500)
                            let apiResponse = responseLib.generate(true, 'Invalid or Malformed Token. Regenerate Token')
                            res.send(apiResponse)
                        } else {
                            logger.error(err.message, 'Authorization Middleware', 10)
                            let apiResponse = responseLib.generate(true, 'Failed To Authenticate', 500, null)
                            res.send(apiResponse)
                        }
                    } else if (check.isEmpty(decoded)) {
                        let apiResponse = responseLib.generate(true, 'Failed To Authenticate', 500, null)
                        res.send(apiResponse)
                    } else {
                        console.log('--------------------')
                        console.log(decoded.data)

                        req.user = { userId: decoded.data.userId }

                        next()
                    }
                })
            }
        })
    } else {
        logger.error('Authentication Token Missing', 'Authentication Middleware', 5)
        let apiResponse = responseLib.generate(true, 'Authentication Token Is Missing In Request', 400, null)
        res.send(apiResponse)
    }
}


let isAuthorized = (req, res, next) => {
    console.log('--- inside isAuthorized function ---')

    if (req.params.apiKey || req.query.apiKey || req.body.apiKey || req.header('apiKey')) {
        let apiKey = req.params.apiKey || req.query.apiKey || req.body.apiKey || req.header('apiKey')
        let options = {
            method: 'GET',
            uri: `https://gateways.edwisor.com/user-gateway/api/v1/user/project/auth?edProjectAuth=${apiKey}`
        }
        request(options, (err, response, body) => {
            // console.log(body)
            if (err) {
                let apiResponse = responseLib.generate(true, 'Failed To Validate Your Token', 500, null)
                res.send(apiResponse)
            } else if (response.statusCode === 200) {
                body = JSON.parse(body)
                if (body.status === 200) {
                    req.user = { email: `${body.data.email} `, email: body.data.email }
                    // req.user = { fullName: `${body.data.firstName} ${body.data.lastName}`, firstName: body.data.firstName, lastName: body.data.lastName, email: body.data.email, mobileNumber: body.data.mobileNumber }
                    next();
                } else {
                    let apiResponse = responseLib.generate(true, 'Expired Or Invalid Authentication Token', 400, null)
                    res.send(apiResponse)
                }
            } else {
                let apiResponse = responseLib.generate(true, 'Could Not Fetch Token Details', 400, null)
                res.send(apiResponse)
            }
        })

    } else {
        logger.error('Authentication Token Missing', 'Authentication Middleware', 5)
        let apiResponse = responseLib.generate(true, 'Authentication Token Is Missing In Request', 403, null)
        res.send(apiResponse)
    }
}


module.exports = {
    isAuthenticated: isAuthenticated,
    isAuthorized: isAuthorized
}