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