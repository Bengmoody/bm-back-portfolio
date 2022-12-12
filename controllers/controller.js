const { selectCategories } = require('../models/model.js')
const app = require('../app.js')


exports.getCategories = (req,res) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send({categories})
    })
}