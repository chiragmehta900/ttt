const mongoose = require('mongoose')
const Schema = mongoose.Schema
const time = require('../libs/timeLib')

const adminLoginSchema = new Schema({
    adminId: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('adminLogin', adminLoginSchema)