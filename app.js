const express = require('express')
const apiRouter = require('./routers/api-router')

let app = express();
app.use(express.json())

app.use('/api',apiRouter)



app.use((err,req,res,next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg:"review_id is not in correct format"})
    } else if (err.code === "23503") {
        let msg = err.constraint.split("_")
        msg.splice(0,1)
        msg.splice(-1,1)
        if (msg.length > 1) {
            msg=msg.join("_")
        } else {
            msg = msg[0]
        }
        msg += " is not found in database"
        res.status(404).send({msg})
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