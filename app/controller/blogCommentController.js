const express = require('express')
const mongoose = require('mongoose');
const shortid = require('shortid');
const response = require('../libs/responseLib')
// const Order = mongoose.model('Order');
const Blog = mongoose.model('blogs');
const CommentModel = mongoose.model('blogComment')

// blog comment add
let createComment = (req, res) => {
    var today = Date.now()
    let commentId = shortid.generate()
    let blogId = req.body.blogId
    let rating = req.body.rating
    let commentTitle = req.body.commentTitle
    let commentDesc = req.body.commentDesc
    let commentSubject = req.body.commentSubject

    let newComment = new CommentModel({
        commentId: commentId,
        blogId: blogId,
        rating: rating,
        commentTitle: commentTitle,
        commentDesc: commentDesc,
        commentSubject: commentSubject
    }) // end new blog model

    let tags = (req.body.tags != undefined && req.body.tags != null && req.body.tags != '') ? req.body.tags.split(',') : []
    newComment.tags = tags

    newComment.save(async (err, result) => {
        if (err) {
            let apiResponse = response.generate(true, 'Comment Added', 400, err)
            res.send(apiResponse)
        } else {
            //cart exists for user
            // let itemIndex = order.orders.findIndex(
            //     (p) => p.productId == productId
            // );
            // if (itemIndex > -1) {

            //     let productItem = order.orders[itemIndex];
            //     productItem.isCommented = true;
            //     order = await order.save();
            // }
            //calculate avgRating and update product tbale filed avgRating
            let comments = await CommentModel.find({ 'blogId': blogId });
            var stars = []
            comments.forEach(element => {
                stars.push(element.rating)
            });
            count = 0,
                sum = 0;

            stars.forEach(function (value, index) {
                count += value;
            });

            const avgRate = Math.round(count / stars.length * 100) / 100 || 0
            product = await Blog.findOneAndUpdate({ 'blogId': blogId }, { $set: { avgRating: avgRate } }).exec()

            let apiResponse = response.generate(false, 'Comment Added', 200, result)
            res.send(apiResponse)

        }
    }) // end new blog save
}
// blog comment end

module.exports = {
    createComment: createComment
}