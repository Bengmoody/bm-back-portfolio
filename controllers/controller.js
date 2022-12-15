const { selectCategories, selectReviews, selectReviewsById,selectComments, insertComments, selectUsers,updateVotesByReviewId, deleteComment,selectUserByUsername } = require('../models/model.js')
const app = require('../app.js')
const {bodyTypeChecker,categoryChecker} = require('../db/utils')
const fs = require('fs/promises')


exports.getCategories = (req,res) => {
    selectCategories(req.query)
    .then((categories) => {
        res.status(200).send({categories})
    })
}

exports.getReviews = (req,res,next) => {
    let promises = [categoryChecker(req,res),selectReviews(req.query)]
    return Promise.all(promises)
    .then(([msg,reviews]) => {
        res.status(200).send({reviews})
    })
    .catch((err) => {
        next(err)
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
        err.prop_name = "review_id"

        next(err);
    })
}
exports.getReviewsById = (req,res,next) => {
    selectReviewsById(req.params.review_id)
    .then((review) => {
        res.status(200).send({review})
    })
    .catch((err) => {
        err.prop_name = "review_id"
        next(err)
    })
}

exports.addComments = (req,res,next) => {
    const typeObject = {body:"string",username:"string",review_id:"number"}

    const newComment = req.body;
    newComment.review_id = parseInt(req.params.review_id)
    return bodyTypeChecker(newComment,typeObject)
    .then((resolveMsg) => {
        return insertComments(newComment)
    })
    .then((comment) => {
        res.status(201).send({comment})
    })
    .catch((err) => {
        err.prop_name = "review_id"

        next(err)
    })
}
exports.changeVotesByReviewId = (req,res,next) => {
    let passedReviewCheck=false;;

    return selectReviewsById(req.params.review_id)
    .then(() => {
        passedReviewCheck=true;
        return updateVotesByReviewId(req.body,req.params.review_id)
    })    
    .then((review) => {
        res.status(202).send({review})
    })
    .catch((err) => {
        if (passedReviewCheck) {
            err.prop_name = "inc_votes"
        } else {
            err.prop_name = "review_id"
        }
        next(err)
    })
}

exports.getUsers = (req,res) => {
    selectUsers()
    .then((users) => {
        res.status(200).send({users})
    })
}

exports.removeComment = (req,res,next) => {
    deleteComment(req.params.comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch((err) => {
        err.prop_name = "comment_id"
        next(err);
    })
}

exports.fetchJson = (req,res,next) => {
    fs.readFile(`${__dirname}/../endpoints.json`,"utf-8")
    .then((data) => {
        let cleanStr = data.split("\n").join("")
        let parsedData = JSON.parse(cleanStr)
        let endpoints = JSON.stringify(parsedData)
        res.status(200).send({endpoints})
    })
    .catch((err) => {
        err.status = 404;
        err.msg = "endpoints.json file not found in main directory";
        next(err)
    })
}

exports.getUserByUsername = (req,res,next) => {
    selectUserByUsername(req.params.username)
    .then((user) => {
        res.status(200).send({user})
    })
    .catch((err) => {
        err.prop_name = "username"
        next(err)
    })

}