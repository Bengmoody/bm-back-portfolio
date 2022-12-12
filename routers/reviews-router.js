const express = require('express')
const reviewsRouter = express.Router()
const app = require('../app')
const { getCategories,getReviews, getReviewsById } = require('../controllers/controller')


reviewsRouter.get('/',getReviews)
reviewsRouter.get('/:review_id',getReviewsById)

module.exports = reviewsRouter;