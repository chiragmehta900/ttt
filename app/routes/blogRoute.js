const express = require('express')
const BlogCrontroller = require('../controller/blogController')


let setRouter = (app) => {
    //create blog
    app.post('/blog', BlogCrontroller.createBlog);  //work

    //view all blog
    app.get('/blog/all', BlogCrontroller.getAllBlog); // work

    // view by ID
    app.get('/blog/:blogId', BlogCrontroller.viewByBlogId); // work

    // edit blog
    app.put('/blog/edit/:blogId', BlogCrontroller.editBlog); //work

    // delete blog
    app.put('/blog/delete/:blogId', BlogCrontroller.deleteBlog); // work
}


module.exports = {
    setRouter: setRouter
}