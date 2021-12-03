const express = require('express')
const mongoose = require('mongoose');
const shortid = require('shortid');
const passwordLib = require('../libs/generatePasswordLib');
const response = require('../libs/responseLib');
const nodemailer = require("nodemailer");
const creds = require("../../config/credentail");
const check = require('../libs/checkLib')
const AdminLoginModel = mongoose.model('adminLogin')
// auth add
const AuthModel = mongoose.model('Auth')
const time = require('./../libs/timeLib');
const token = require('../libs/tokenLib')


let adminPasswordGenerate = (req, res) => {

    // through this we can add gmail 

    // let newAdmin = new AdminLoginModel({
    //     adminId: shortid.generate(),
    //     email: req.body.email,
    //     password: passwordLib.hashpassword(req.body.password),
    // })

    // let tags = (req.body.tags != undefined && req.body.tags != null && req.body.tags != '') ? req.body.tags.split(',') : []
    // newAdmin.tags = tags
    // newAdmin.save((err, result) => {
    //     if (err) {
    //         console.log(err)
    //         res.send(err)
    //     } else {
    //         res.send(result)
    //     }
    // })

    var tmpPassword = shortid.generate();
    AdminLoginModel.findOneAndUpdate({ 'email': req.body.email }, { $set: { password: passwordLib.hashpassword(tmpPassword) } }).exec((err, result) => {
        if (err) {
            let apiResponse = response.generate(true, 'No admin Found', 400, err)
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
                to: req.body.email,
                subject: "Admin Password",
                text: 'Hello,\n\n' + 'your Tempory Password is: ' + tmpPassword + '\n'
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



let adminlogin = async (req, res) => {

    function getNumberOfDays(start, end) {
        const date1 = new Date(start);
        const date2 = new Date(end);

        // One day in milliseconds
        const oneDay = 1000 * 60 * 60 * 24;

        // Calculating the time difference between two dates
        const diffInTime = date2.getTime() - date1.getTime();

        // Calculating the no. of days between two dates
        const diffInDays = Math.round(diffInTime / oneDay);

        return diffInDays;
    }

    let findUser = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {

                AdminLoginModel.findOne({ email: req.body.email }, (err, userDetails) => {

                    if (err) {
                        /* generate the error message and the api response message here */
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                        /* if Company Details is not found */
                    } else if (check.isEmpty(userDetails)) {
                        /* generate the response and the console error message here */
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else if (userDetails.isVerify === false) {
                        let apiResponse = response.generate(true, 'Your account has not been verified.', 401, null)
                        reject(apiResponse)
                        //  return res.status(401).send({ type: 'not-verified', msg: '' }); 

                    } else {
                        /* prepare the message and the api response here */
                        const result = getNumberOfDays(userDetails.updatedAt, new Date().toISOString());
                        if (result < 2) {
                            resolve(userDetails)
                        } else {
                            let apiResponse = response.generate(true, 'Your Password is expired', 400, null)
                            reject(apiResponse)
                        }
                    }
                });

            } else {
                let apiResponse = response.generate(true, '"email" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let validatePassword = (retrievedUserDetails) => {
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                if (err) {
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                } else if (isMatch) {
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                    delete retrievedUserDetailsObj.password
                    delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    delete retrievedUserDetailsObj.modifiedOn
                    resolve(retrievedUserDetailsObj)
                } else {
                    let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 400, null)
                    reject(apiResponse)
                }
            })
        })
    }

    // auth token added

    let generateToken = (userDetails) => {
        console.log("generate token");
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }

    let saveToken = (tokenDetails) => {
        console.log("save token");
        return new Promise((resolve, reject) => {
            AuthModel.findOne({ userId: tokenDetails.userId }, (err, retrievedTokenDetails) => {
                if (err) {
                    console.log(err.message, 'userController: saveToken', 10)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrievedTokenDetails.tokenGenerationTime = time.now()
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
            })
        })
    }

    // auht token end

    findUser(req, res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status)
            res.send(err)
        })

}

module.exports = {
    adminPasswordGenerate: adminPasswordGenerate,
    adminlogin: adminlogin
}