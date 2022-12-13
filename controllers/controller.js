const { selectCategories, selectReviews, selectComments } = require('../models/model.js')
const app = require('../app.js')


exports.getCategories = (req,res) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send({categories})
    })
}

exports.getReviews = (req,res) => {
    selectReviews()
    .then((reviews) => {
        res.status(200).send({reviews})
    })
}


exports.getComments = (req,res) => {
   selectComments(req.params.review_id)
   .then((comments) => {
        res.status(200).send({comments})
   })
}