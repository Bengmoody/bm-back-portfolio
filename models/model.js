const db = require('../db/connection.js')

exports.selectCategories = ({category}) => {
    
    let qryStr = 'SELECT * FROM categories'
    let params = []
    if (category !== undefined) {
        qryStr += ' WHERE slug=$1'
        params.push(category)
    }
    qryStr += ';'
    return db.query(qryStr,params)
    .then(({rows}) => {
        return rows;
    })
}

exports.selectReviews = ({category, sort_by="created_at",order="DESC"}) => {
    const acceptedSorts = ["owner","title","review_id","review_img_url","votes","designer","comment_count","created_at"]
    const acceptedOrders = ["DESC","ASC"]
    if (!acceptedSorts.includes(sort_by)) {
        return Promise.reject({status:400,msg:"invalid query"})
    }
    if (!acceptedOrders.includes(order.toUpperCase())) {
        return Promise.reject({status:400,msg:"order by query invalid"})
    }
    let sqlStr = `SELECT owner,title,review_id,category,review_img_url,reviews.created_at,reviews.votes,designer,COUNT(comments.comment_id) AS comment_count FROM reviews LEFT JOIN comments USING (review_id)`
    let params = []

    if (category !== undefined) {
        sqlStr += ` WHERE category = $1`
                params.push(category)
    }
    sqlStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`
    return db.query(sqlStr,params)
    .then(({rows}) => {
        return rows;
    })
}

exports.selectComments = (review_id,offset,limit) => {
    let params = [review_id,limit]
    let sqlStr = 'WITH cte AS (SELECT * FROM comments WHERE review_id=$1) SELECT * FROM (TABLE cte ORDER BY created_at DESC LIMIT $2'
    if (offset !== undefined && Number.isNaN(offset) !== true) {
            sqlStr+=' OFFSET $3'
            params.push(offset)
    } else if (offset !== undefined && Number.isNaN(offset) === true) {
        return Promise.reject({status:400,msg:"page query is in incorrect format"})
    }
    sqlStr += ') sub RIGHT JOIN (SELECT count(*) FROM cte) c(total_count) ON true;'
    return db.query(sqlStr,params)
    .then(({rows}) => {
        let testRows = [...rows]
        if (testRows.length === 1) {
            let vals = Object.values(testRows[0])
            if (parseInt(vals.at(-1)) !== 0 && vals.at(0) === null) {
                return Promise.reject({status:400, msg:"missing page requested"})
            } else if (parseInt(vals.at(-1)) === 0) {
                return  {rows:[],total_count:0};
            }
        }
        if (rows.length !== 0) {
            let total = rows[0].total_count
            rows.forEach((row) => {
                delete row.total_count;
            })
            return {rows,"total_count":total};
        }
    })
}


exports.selectReviewsById = (review_id) => {
    return db.query('SELECT title,designer,owner,review_body,review_id,review_img_url,category,reviews.created_at,reviews.votes,COUNT(comments.comment_id) AS comment_count FROM reviews LEFT JOIN comments USING (review_id) WHERE review_id = $1 GROUP BY reviews.review_id',[review_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status:404, msg: "review_id is not found in database"})
        } else { 
            return rows[0];
        }
   })
}

exports.insertComments = ({body,username,review_id}) => {
    let inputArr = [body,username,review_id];
    return db.query('INSERT INTO comments (body, author, review_id, votes) VALUES ($1,$2,$3,0) RETURNING *;',inputArr)
    .then(({rows}) => {
        return rows[0]
    })
}

exports.updateVotesByReviewId = (body,review_id) => {
    return db.query('UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;',[body.inc_votes,review_id])
    .then(({rows}) => {
        return rows[0]
    })
}
exports.selectUsers = () => {
    return db.query('SELECT * FROM users;')
    .then(({rows}) => {
        return rows;
    })
}

exports.deleteComment = (comment_id) => {
    return db.query('DELETE FROM comments WHERE comment_id=$1 RETURNING *;',[comment_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status:404,msg:"comment_id not found in database"})
        } else {
            return;
        }
    })
}

exports.selectUserByUsername = (username) => {
    return db.query("SELECT * FROM users WHERE username=$1;",[username])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status:404,msg: "username not found in database"})
        }
        return rows[0];
    })
}

exports.updateVotesByCommentId = ({inc_votes, comment_id}) => {
    return db.query("UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;",[inc_votes,comment_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status:404, msg: "comment_id not found in database"})
        } else {
            return rows[0];
        }
    })
}

exports.insertReview = ({owner,title,review_body,designer,category}) => {
    let inputArr = [owner,title,review_body,designer,category]
    return db.query("INSERT INTO reviews (owner,title,review_body,designer,category) VALUES ($1,$2,$3,$4,$5) RETURNING review_id;",inputArr)
    .then(({rows}) => {
        return rows[0].review_id;        
    })

}