const express = require('express')
const mongoose = require('mongoose');
const shortid = require('shortid');
const response = require('../libs/responseLib');
const BlogModel = mongoose.model('blogs')
const CommentModel = mongoose.model('blogComment')

// Create blog
let createBlog = async (req, res) => {
    try {
        let blogId = shortid.generate()
        let blogTitle = req.body.blogTitle
        let blogDescription = req.body.blogDescription
        let blogImage = req.body.blogImage

        const newBlog = new BlogModel({
            blogId: blogId,
            blogTitle: blogTitle,
            blogDescription: blogDescription,
            blogImage: blogImage
        })

        newBlog.save((err, result) => {
            if (err) {
                let apiResponse = response.generate(true, 'no blog detail found.', 400, err)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'blog added successful.', 200, result)
                res.send(apiResponse)
            }
        })
    } catch (error) {
        let apiResponse = response.generate(true, '', 500, error.message)
        return res.send(apiResponse)
    }

}
// end create blog


// view all blog
let getAllBlog = (req, res) => {
    BlogModel.find()
        .select('-__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                let apiResponse = response.generate(true, 'no blog found.', 400, err)
                res.send(apiResponse)
            } else if (result == undefined || result == null || result == '') {
                res.send("no blog found.")
            } else {
                let apiResponse = response.generate(false, 'All blog display successful.', 200, result)
                res.send(apiResponse)
            }
        })
}
// end view blog


// blog view by ID
let viewByBlogId = (req, res) => {

    BlogModel.findOne({ 'blogId': req.params.blogId }, async (err, result) => {

        if (err) {
            let apiResponse = response.generate(true, 'error', 400, err)
            res.send(apiResponse);
        } else if (result == undefined || result == null || result == '') {
            let apiResponse = response.generate(true, 'no blog found.', 400, null)
            res.send(apiResponse);
        } else {
            let comments = await CommentModel.find({ 'blogId': req.params.blogId });
            var stars = []
            comments.forEach(element => {
                stars.push(element.rating)
            });
            count = 0,
                sum = 0;

            stars.forEach(function (value, index) {
                count += value;
            });

            const avgRaing = Math.round(count / stars.length * 100) / 100 || 0

            let sendData = { "comments": comments, avgRating: avgRaing, products: result }

            let apiResponse = response.generate(false, 'blog view successful.', 200, sendData)
            res.send(apiResponse);
        }
    })
}
// end blog view by ID


// edit blog
let editBlog = async (req, res) => {
    try {
        if (req.params.blogId === null) {
            res.status(404).send("blog Not Found")
        } else {
            let options = req.body;

            BlogModel.update({ 'blogId': req.params.blogId }, options, { multi: true }).exec((err, result) => {

                if (err) {
                    console.log(err)
                    res.send(err)
                } else if (result == undefined || result == null || result == '') {
                    res.send("blog not found.")
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
// end edit blog


// delete blog
let deleteBlog = async (req, res) => {
    try {
        let isActive = req.body.isActive;
        BlogModel.findOneAndUpdate({ 'blogId': req.params.blogId }, { $set: { isActive: false } }).exec((err, result) => {
            if (err) {
                let apiResponse = response.generate(true, 'error', 400, err)
                res.send(apiResponse);
            } else if (result == undefined || result == null || result == '') {
                let apiResponse = response.generate(true, 'no blog found.', 400, null)
                res.send(apiResponse);
            } else {
                let apiResponse = response.generate(false, 'blog delete successful.', 200, result)
                res.send(apiResponse);
            }
        })
    } catch (error) {
        let apiResponse = response.generate(true, '', 500, error.message)
        return res.send(apiResponse)
    }
}
// end delete blog



module.exports = {
    createBlog: createBlog,
    getAllBlog: getAllBlog,
    viewByBlogId: viewByBlogId,
    editBlog: editBlog,
    deleteBlog: deleteBlog
}