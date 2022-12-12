const express = require('express')
const apiRouter = express.Router()
const app = require('../app')
const { getCategories } = require('../controllers/controller')
const reviewsRouter = require('./reviews-router')


apiRouter.get('/categories',getCategories)

apiRouter.use('/reviews',reviewsRouter)

module.exports = apiRouter;