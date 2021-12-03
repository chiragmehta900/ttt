const express = require('express')
const mongoose = require('mongoose');
const shortid = require('shortid');
const response = require('../libs/responseLib');
const ProjectModel = mongoose.model('projects')

// Create Project
let createProject = async (req, res) => {
    try {
        let ProjectId = shortid.generate()
        let projectName = req.body.projectName
        let ProjectDescription = req.body.ProjectDescription
        let ProjectImage = req.body.ProjectImage

        const newProject = new ProjectModel({
            ProjectId: ProjectId,
            projectName: projectName,
            ProjectDescription: ProjectDescription,
            ProjectImage: ProjectImage
        })

        newProject.save((err, result) => {
            if (err) {
                let apiResponse = response.generate(true, 'No project detail found.', 400, err)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Project detail added successful.', 200, result)
                res.send(apiResponse)
            }
        })
    } catch (error) {
        let apiResponse = response.generate(true, '', 500, error.message)
        return res.send(apiResponse)
    }
}
// end create project


// view all project
let getAllProject = (req, res) => {
    ProjectModel.find()
        .select('-__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                let apiResponse = response.generate(true, 'no project detail found.', 400, err)
                res.send(apiResponse)
            } else if (result == undefined || result == null || result == '') {
                res.send("project not found.")
            } else {
                let apiResponse = response.generate(false, 'all project display successful.', 200, result)
                res.send(apiResponse)
            }
        })
}
// end view project


// project view by ID
let viewByProjectId = (req, res) => {

    ProjectModel.findOne({ 'ProjectId': req.params.ProjectId }, (err, result) => {

        if (err) {
            let apiResponse = response.generate(true, 'error', 400, err)
            res.send(apiResponse);
        } else if (result == undefined || result == null || result == '') {
            let apiResponse = response.generate(true, 'project not found.', 400, null)
            res.send(apiResponse);
        } else {
            let apiResponse = response.generate(false, 'project display successful.', 200, result)
            res.send(apiResponse);
        }
    })
}
// end project view by ID


// edit project
let editProject = async (req, res) => {
    try {
        if (req.params.ProjectId === null) {
            res.status(404).send("project Not Found")
        } else {
            let options = req.body;

            ProjectModel.update({ 'ProjectId': req.params.ProjectId }, options, { multi: true }).exec((err, result) => {
                if (err) {
                    console.log(err)
                    res.send(err)
                } else if (result == undefined || result == null || result == '') {
                    res.send("No project Found")
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
// end edit project


// delete project
let deleteProject = async (req, res) => {
    try {
        let isActive = req.body.isActive;
        ProjectModel.findOneAndUpdate({ 'ProjectId': req.params.ProjectId }, { $set: { isActive: false } }).exec((err, result) => {
            if (err) {
                let apiResponse = response.generate(true, 'error', 400, err)
                res.send(apiResponse);
            } else if (result == undefined || result == null || result == '') {
                let apiResponse = response.generate(true, 'project not found.', 400, null)
                res.send(apiResponse);
            } else {
                let apiResponse = response.generate(false, 'project delete successful.', 200, result)
                res.send(apiResponse);
            }
        })
    } catch (error) {
        let apiResponse = response.generate(true, '', 500, error.message)
        return res.send(apiResponse)
    }
}
// end delete project




module.exports = {
    createProject: createProject,
    getAllProject: getAllProject,
    viewByProjectId: viewByProjectId,
    editProject: editProject,
    deleteProject: deleteProject
}