const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blogSchema = new Schema({
    blogId: {
        type: String,
        unique: true
    },
    blogTitle: {
        type: String,
        required: true
    },
    blogDescription: {
        type: String,
        required: true
    },
    blogImage: {
        type: String,
        required: true
    },
    avgRating: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('blogs', blogSchema)