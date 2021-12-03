const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clientSchema = new Schema({
    clientId: {
        type: String,
        unique: true
    },
    clientName: {
        type: String,
        required: true
    },
    clientLogo: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('client', clientSchema)