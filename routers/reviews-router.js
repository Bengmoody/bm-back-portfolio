const express = require('express')
const reviewsRouter = express.Router()
const app = require('../app')
const { getCategories,getReviews } = require('../controllers/controller')


reviewsRouter.get('/',getReviews)

module.exports = reviewsRouter;