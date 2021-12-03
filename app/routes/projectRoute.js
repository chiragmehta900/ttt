const express = require('express')
const ProjectController = require('../controller/projectController')


let setRouter = (app) => {
    //create project
    app.post('/project', ProjectController.createProject); //work

    //view all project
    app.get('/project/all', ProjectController.getAllProject); //work

    // view by ID
    app.get('/project/:ProjectId', ProjectController.viewByProjectId); //work

    // edit project
    app.put('/project/edit/:ProjectId', ProjectController.editProject); //work

    // delete project
    app.put('/project/delete/:ProjectId', ProjectController.deleteProject); //work
}


module.exports = {
    setRouter: setRouter
}