const express = require('express')
const reviewsRouter = express.Router()
const app = require('../app')
const { getReviews, getReviewsById,getComments, addComments,changeVotesByReviewId, addReview} = require('../controllers/controller')


reviewsRouter.get('/',getReviews)
reviewsRouter.post('/',addReview)
reviewsRouter.get('/:review_id',getReviewsById)
reviewsRouter.patch('/:review_id',changeVotesByReviewId)
reviewsRouter.get('/:review_id/comments',getComments)
reviewsRouter.post('/:review_id/comments',addComments)


module.exports = reviewsRouter;