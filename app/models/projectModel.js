const mongoose = require('mongoose')
const Schema = mongoose.Schema
// const shortid = require('shortid');

const projectsSchema = new Schema({
    ProjectId: {
        type: String,
        unique: true
    },
    projectName: {
        type: String,
        required: true
    },
    ProjectDescription: {
        type: String,
        required: true
    },
    ProjectImage: {
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

module.exports = mongoose.model('projects', projectsSchema)