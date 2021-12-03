const mongoose = require('mongoose')
const Schema = mongoose.Schema

const contactSchema = new Schema({
    contactId: {
        type: String,
        unique: true
    },
    contactName: {
        type: String,
        required: true
    },
    contactSubject: {
        type: String,
        required: true
    },
    contactPhoneNumber: {
        type: Number,
        required: true
    },
    contactMessage: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('contactForm', contactSchema)