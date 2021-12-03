const express = require('express')
const commentController = require('../controller/blogCommentController')


let setRouter = (app) => {
    let baseUrl = '/comment';

    app.post(baseUrl + '/create', commentController.createComment);
}

module.exports = {
    setRouter: setRouter
}