const express = require('express')
const apiRouter = require('./routers/api-router')

let app = express();

app.use('/api',apiRouter)

app.use('*',(req,res) => {
    res.status(400).send({msg:"path not found"})
})

module.exports = app