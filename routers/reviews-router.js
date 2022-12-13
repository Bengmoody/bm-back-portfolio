const express = require('express')
const reviewsRouter = express.Router()
const app = require('../app')
const { getCategories,getReviews, getComments } = require('../controllers/controller')
const reviewIdRouter = require('./review-id-router')

reviewsRouter.get('/',getReviews)

reviewsRouter.use('/:review_id',reviewIdRouter)

module.exports = reviewsRouter;