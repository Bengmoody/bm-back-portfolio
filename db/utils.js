let { selectCategories } = require('../models/model')

exports.bodyTypeChecker = (body,typeObject) => {
    const typeCheckPromise = new Promise((resolve,reject) => {
        // check for types before passing to SQL
        // this is to avoid type coercion, e.g. number being accepted as body by database
        const rejectObject = {status:0,msg:""}
        let changeFlag = false;
        for (let property in typeObject) {
            if ((body[property] === undefined) && (property !== "created_at")) {
                // status 400 as bad request, missing "not null" property
                rejectObject.status = 400 
                rejectObject.msg += property + " is missing" 
                changeFlag = true;
            } else if (typeof body[property] !== typeObject[property]) {
                // status 400 as bad request, wrong datatype of property
                // protects data integrity of database
                rejectObject.status = 400
                rejectObject.msg += property + " is not in correct format"
                changeFlag = true;            
            }
        }
        if (changeFlag) {
            reject(rejectObject)
        } else {
            resolve("success")
        }
    })
    return typeCheckPromise;
}

exports.categoryChecker = (req,res) => {
    
    const categoryChecker = new Promise((resolve,reject) => {
        if (req.query.category === undefined) {
            resolve("no category")
        } else {
            selectCategories(req.query)
            .then((categories) => {
                if (categories.length === 0) {
                    reject({status:404,msg:"category not found in database"})
                } else {
                    resolve("success")
                }
            })    
        }
    })
    return categoryChecker;
}

exports.validateAndPaginate = (results,req) => {
    const validateAndPaginatePromise = new Promise((resolve,reject) => {
        if (req.query.limit === undefined) {
            req.query.limit = 10;
        }
        if (Number.isNaN(parseInt(req.query.p)) && req.query.p !== undefined) {
            reject(({status:400,msg: "pages query is not in correct format"}))
        }
        if (Number.isNaN(parseInt(req.query.limit))) {
            reject(({status:400,msg: "limit query is not in correct format"}))
        }
    
        let resultsCopy = [...results]
        let totalResults = resultsCopy.length
        if (req.query.p !== undefined) {
            let pages = []
            while (resultsCopy.length>=req.query.limit) {
                pages.push(resultsCopy.splice(0,req.query.limit))    
            }
            if (resultsCopy.length > 0) {
                pages.push(resultsCopy)
            }
            if (pages[parseInt(req.query.p)-1] === undefined) {
                reject({status:400,msg: "missing page requested"})
            } else {
                resolve({results:pages[parseInt(req.query.p)-1],total_count:totalResults})
            }
        } else if (req.query.p === undefined) {
            if (parseInt(req.query.limit) >= totalResults) {
                resolve({results:resultsCopy,total_count:totalResults})
            } else {
                resolve({results:resultsCopy.slice(0,req.query.limit),total_count:totalResults})
            }
        }
    })
    return validateAndPaginatePromise;
}