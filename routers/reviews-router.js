const express = require('express')
const reviewsRouter = express.Router()
const app = require('../app')
const { getReviews, getReviewsById,getComments} = require('../controllers/controller')


reviewsRouter.get('/',getReviews)
reviewsRouter.get('/:review_id',getReviewsById)
reviewsRouter.get('/:review_id/comments',getComments)

module.exports = reviewsRouter;