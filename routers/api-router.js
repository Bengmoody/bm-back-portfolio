const express = require('express')
const apiRouter = express.Router()
const app = require('../app')
const { getCategories, getUsers } = require('../controllers/controller')
const reviewsRouter = require('./reviews-router')


apiRouter.get('/categories',getCategories)
apiRouter.get('/users',getUsers)
apiRouter.get('/secrret',(req,res) => {
    res.status(200).send({msg:"I love you Vicky and Aaron"})
})


apiRouter.use('/reviews',reviewsRouter)

module.exports = apiRouter;