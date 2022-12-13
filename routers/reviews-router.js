const express = require('express')
const reviewsRouter = express.Router()
const app = require('../app')
const { getReviews, getReviewsById,getComments, addComments} = require('../controllers/controller')


reviewsRouter.get('/',getReviews)
reviewsRouter.get('/:review_id',getReviewsById)
reviewsRouter.get('/:review_id/comments',getComments)
reviewsRouter.post('/:review_id/comments',addComments)


module.exports = reviewsRouter;