let db = require('../db/connection.js')

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories')
    .then(({rows}) => {
        return rows;
    })


}