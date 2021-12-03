const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BlogCommentSchema = new Schema({

    commentId: {
        type: String,
        unique: true
    },
    blogId: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    commentTitle: {
        type: String,
        required: true
    },
    commentDesc: {
        type: String,
        required: true
    },
    commentSubject: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('blogComment', BlogCommentSchema)