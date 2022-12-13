const db = require('../db/connection.js')

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories')
    .then(({rows}) => {
        return rows;
    })
}

exports.selectReviews = () => {
    return db.query('SELECT owner,title,review_id,category,review_img_url,reviews.created_at,reviews.votes,designer,COUNT(comments.comment_id) AS comment_count FROM reviews LEFT JOIN comments USING (review_id) GROUP BY reviews.review_id ORDER BY created_at DESC;')
    .then(({rows}) => {
        return rows;
    })
}

exports.selectComments = (review_id) => {
   return db.query('SELECT * FROM comments WHERE review_id=$1 ORDER BY created_at DESC',[review_id])
   .then(({rows}) => {
        return rows;
   })
}


exports.selectReviewsById = (review_id) => {
   return db.query('SELECT * FROM reviews WHERE review_id = $1',[review_id])
   .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status:404, msg: "review ID is not found in database"})
        } else { 
            return rows[0];
        }
   })
}

exports.updateVotesByReviewId = ({inc_votes,review_id}) => {
    return db.query('UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;',[inc_votes,review_id])
    .then(({rows}) => {
        console.log(rows)
        return rows[0]
    })
}