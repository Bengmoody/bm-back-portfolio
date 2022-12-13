const express = require('express')
const reviewsRouter = express.Router()
const app = require('../app')
<<<<<<< HEAD
const { getCategories,getReviews, getComments } = require('../controllers/controller')
const reviewIdRouter = require('./review-id-router')
=======
const { getCategories,getReviews, getReviewsById } = require('../controllers/controller')

>>>>>>> main

reviewsRouter.get('/',getReviews)
reviewsRouter.get('/:review_id',getReviewsById)

reviewsRouter.use('/:review_id',reviewIdRouter)

module.exports = reviewsRouter;