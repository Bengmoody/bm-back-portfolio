const { selectCategories, selectReviews, selectReviewsById,selectComments,updateVotesByReviewId } = require('../models/model.js')
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


exports.getComments = (req,res,next) => {
    //check if ID is valid and retrieve comments at the same time
    // if either fail then reject
    const promises = [selectReviewsById(req.params.review_id),selectComments(req.params.review_id)]
    return Promise.all(promises)
    .then(([review, comments]) => {
        res.status(200).send({comments})
    })
    .catch((err) => {
        next(err);
    })
}
exports.getReviewsById = (req,res,next) => {
    selectReviewsById(req.params.review_id)
    .then((review) => {
        res.status(200).send({review})
    })
    .catch((err) => {
        next(err)
    })
}

exports.changeVotesByReviewId = (req,res) => {
    updateVotesByReviewId(req.body,req.params.review_id)
    .then((review) => {
        res.status(202).send({review})
    })
}