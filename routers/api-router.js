const express = require('express')
const apiRouter = express.Router()
const app = require('../app')
const { getCategories, getUsers, removeComment, fetchJson, getUserByUsername } = require('../controllers/controller')
const reviewsRouter = require('./reviews-router')


apiRouter.get('/categories',getCategories)
apiRouter.get('/users',getUsers)
apiRouter.get('/users/:username',getUserByUsername)
apiRouter.get('/secret',(req,res) => {
    res.status(200).send({msg:"I love you Vicky and Aaron"})
})
apiRouter.delete('/comments/:comment_id',removeComment)
apiRouter.get('/',fetchJson)


apiRouter.use('/reviews',reviewsRouter)

module.exports = apiRouter;