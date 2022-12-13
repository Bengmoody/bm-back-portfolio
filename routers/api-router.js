const express = require('express')
const apiRouter = express.Router()
const app = require('../app')
const { getCategories, getUsers } = require('../controllers/controller')
const reviewsRouter = require('./reviews-router')


apiRouter.get('/categories',getCategories)
apiRouter.get('/users',getUsers)

apiRouter.use('/reviews',reviewsRouter)

module.exports = apiRouter;