const mongoose = require('mongoose')
const Schema = mongoose.Schema

const portfolioSchema = new Schema({
    portfolioId: {
        type: String,
        unique: true
    },
    portfolioTitle: {
        type: String,
        required: true
    },
    portfolioDescription: {
        type: String,
        required: true
    },
    portfolioImage: {
        type: String,
        required: true
    },
    portfolioType: {
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

module.exports = mongoose.model('portfolio', portfolioSchema)