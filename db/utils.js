

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