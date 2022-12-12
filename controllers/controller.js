const { selectCategories, selectReviews, selectReviewsById } = require('../models/model.js')
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

exports.getReviewsById = (req,res,next) => {
    const reviewIdCheckPromise = new Promise((resolve,reject) => {
        if (req.params.review_id.match(/\b\d+\b/g) === null) {
            reject({status:400,msg:"review ID is not in correct format"})
        } else {
            resolve(req.params.review_id)
        }
    })
    return reviewIdCheckPromise.then((review_id) => {
        return selectReviewsById(review_id)
    })
    .then((review) => {
        res.status(200).send({review})
    })
    .catch((err) => {
        next(err)
    })
    
}