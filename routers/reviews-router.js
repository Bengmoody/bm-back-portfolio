const express = require('express')
const reviewsRouter = express.Router()
const app = require('../app')
const { getCategories,getReviews, getComments } = require('../controllers/controller')


reviewsRouter.get('/',getReviews)

reviewsRouter.get('/:review_id/comments',getComments)

module.exports = reviewsRouter;