const express = require('express')
const apiRouter = require('./routers/api-router')

let app = express();

app.use(express.json())

app.use('/api',apiRouter)


app.use((err,req,res,next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg:"review ID is not in correct format"})
    } else {
        next(err)
    }
})

app.use((err,req,res,next) => {
    if (err.msg !== undefined) {
        res.status(err.status).send({msg:err.msg})
    } else {
        next(err);
    }
})

app.use('*',(req,res) => {
    res.status(400).send({msg:"path not found"})
})

module.exports = app