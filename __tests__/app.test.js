const request = require('supertest')
const db = require('../db/connection')
const app = require('../app.js')
const seed = require('../db/seeds/seed')

// bring in data from test data files
const testData = require('../db/data/test-data/index.js')

// re-seed database before each test
beforeEach(() => {
    return seed(testData);
})

// after all tests, disconnect from database
afterAll(() => {
    return db.end();
})

// MAIN TESTING BODY


// get api/categories
describe('GET /api/categories',() => {
    test("check that status 200 is returned",() => {
        return request(app).get('/api/categories').expect(200)
    })
    test("check that 4 rows are returned and they have the required format",() => {
        return request(app).get('/api/categories')
        .then(({body: { categories }}) => {
            expect(categories).toHaveLength(4);
            categories.forEach((category) => {
                expect(category).toEqual(
                    expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                )
            })

        })
    })
})

// get api/reviews
describe('GET /api/reviews',() => {
    
    test("check that status 200 returned and the structure of the results is correct",() => {
        return request(app).get('/api/reviews')
        .expect(200)
        .then(({body:{reviews}}) => {
            expect(reviews).toHaveLength(13)
            reviews.forEach((review) => {
                expect(review).toEqual(
                    expect.objectContaining({
                        owner: expect.any(String),
                        title: expect.any(String),
                        designer: expect.any(String),
                        review_img_url: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        review_id: expect.any(Number),
                        category: expect.any(String),
                        comment_count: expect.any(String)
                    })
                )
            })
            expect(reviews).toBeSortedBy('created_at',{descending:true})
        })
    })
})

describe('error handling for wrong path (only possible error so far)',() => {
    test("GET /api/banana",() => {
        return request(app).get('/api/banana')
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg:"path not found"})
        })
    })
})

// get api/reviews/:review_id
describe("get /api/reviews/:review_id",() => {
    test("check status 200 returned, and singular object returned with correct properties",() => {
        return request(app).get('/api/reviews/4')
        .expect(200).then(({body:{review}}) => {
            expect(review.review_id).toBe(4)
            expect(review.title).toBe('Dolor reprehenderit')
            expect(review.review_body).toBe('Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod')
            expect(review.designer).toBe('Gamey McGameface')
            expect(review.review_img_url).toBe('https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')
            expect(review.votes).toBe(7)
            expect(review.category).toBe('social deduction')
            expect(review.owner).toBe('mallionaire')
            expect(typeof review.created_at).toBe("string")
        })
    })
    test("check that if user puts in non-numerical review_id, error is handled",() => {
        return request(app).get('/api/reviews/bananas')
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg: "review_id is not in correct format"})
        })

    })
    test("check that if user puts in valid but unmatched review_id, error is handled",() => {
        return request(app).get('/api/reviews/27')
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: "review ID is not found in database"})
        })

    })

})

// get api/reviews/:review_id/comments
describe('GET /api/reviews/:review_id/comments',() => {
    test("check it gives the correct status, and correct data when given a review_id with existing comments",() => {
        return request(app).get('/api/reviews/2/comments')
        .expect(200)
        .then(({body: {comments}}) => {
            expect(comments).toHaveLength(3)
            comments.forEach((comment) => {
                expect(comment.review_id).toBe(2)
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String)
                    })
                )
            })
        })
    })
    test("check comments are sorted with most recent first",() => {
        return request(app).get('/api/reviews/2/comments')
        .expect(200)
        .then(({body: {comments}}) => {
            expect(comments).toBeSortedBy('created_at',{descending:true})
            
        })
    })
    test("check that status 200 and empty array when review has no comments",() => {
        return request(app).get('/api/reviews/1/comments')
        .expect(200)
        .then(({body:{comments}}) => {
            expect(comments).toHaveLength(0)
        })
    })
    test("check that status 400 and error message when review_id is invalid",() => {
        return request(app).get('/api/reviews/banana/comments')
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg:"review_id is not in correct format"})
        })
    })
    test("check that status 404 and error message when review_id is invalid",() => {
        return request(app).get('/api/reviews/25/comments')
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg:"review ID is not found in database"})
        })
    })
})

describe('POST /api/reviews/:review_id/comments',() => {
    test("responds with a 201 and the data entered into the database if successful",() => {
        const newComment = {body:"I freaking love this thing", username: "bainesface"}
        
        return request(app).post('/api/reviews/2/comments')
        .send(newComment)
        .expect(201)
        .then(({body:{comment}}) => {
            expect(comment.comment_id).toEqual(7)
            expect(comment.body).toEqual("I freaking love this thing")
            expect(comment.author).toEqual("bainesface")
            expect(comment.review_id).toEqual(2)
            expect(comment.votes).toEqual(0)
            expect(typeof comment.created_at).toBe("string")
        })
    })
    test("when review_id not found, responds with a 404 && error message",() => {
        const newComment = {body:"I freaking love this thing", username: "bainesface"}
        
        return request(app).post('/api/reviews/25/comments')
        .send(newComment)
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg:"review_id is not found in database"})
        })
    })
    test("when review_id not correct, responds with a 400 && error message",() => {
        const newComment = {body:"I freaking love this thing", username: "bainesface"}
        
        return request(app).post('/api/reviews/banana/comments')
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg:"review_id is not in correct format"})
        })
    })
    test("can handle errors in body (incorrect type )",() => {
        const newComment = {body:2, username: "bainesface"}        
        return request(app).post('/api/reviews/2/comments')
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg:"body is not in correct format"})
        })
    })
    test("can handle errors in body (missing)",() => {
        const newComment = {username: "bainesface"}
        return request(app).post('/api/reviews/2/comments')
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg:"body is missing"})
        })
    })
    test("can handle errors in author (incorrect type)",() => {
        const newComment = {body:"games rule bro", username: 16}        
        return request(app).post('/api/reviews/2/comments')
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg:"username is not in correct format"})
        })
    })
    test("can handle errors in author (missing)",() => {
        const newComment = {body:"games rule bro"}
        return request(app).post('/api/reviews/2/comments')
        .send(newComment)
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg:"username is missing"})
        })
    })
    test("can handle errors in author (correct format but not valid)",() => {
        const newComment = {body:"games rule bro",username:"bob27"}
        return request(app).post('/api/reviews/2/comments')
        .send(newComment)
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg:"username is not found in database"})
        })
    })
    test("user tries to hand in extra things, code should ignore them --> 201, correct properties",() => {
        const newComment = {body:"games rule bro",votes: "I vote yes", username: "bainesface",created_at: new Date(1616874588115)}        
        return request(app).post('/api/reviews/2/comments')
        .send(newComment)
        .expect(201)
        .then(({body:{comment}}) => {
            expect(comment.comment_id).toEqual(7)
            expect(comment.body).toEqual("games rule bro")
            expect(comment.author).toEqual("bainesface")
            expect(comment.review_id).toEqual(2)
            expect(comment.votes).toEqual(0)
            expect(typeof comment.created_at).toBe("string")
        })
    })
})

// GET /api/reviews (queries)
describe("GET /api/reviews (queries)",() => {
    test("if valid category, returns only reviews with the specified category, 200", () => {
        return request(app).get('/api/reviews?category=dexterity')
        .expect(200)
        .then(({body:{reviews}}) => {
            expect(reviews).toHaveLength(1)
            expect(reviews[0].title).toEqual('Jenga')
            expect(reviews[0].review_id).toEqual(2)
            expect(reviews[0].designer).toEqual('Leslie Scott')
            expect(reviews[0].owner).toEqual('philippaclaire9')
            expect(reviews[0].review_img_url).toEqual('https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png')
            expect(reviews[0].category).toEqual('dexterity')
            expect(reviews[0].votes).toEqual(5)
            expect(reviews[0].comment_count).toEqual("3")
            expect(typeof reviews[0].created_at).toEqual('string')
        })
    })
    test("valid category with no reviews returns empty array", () => {
        return request(app).get('/api/reviews?category=children%27s+games')
        .expect(200)
        .then(({body:{reviews}}) => {
           expect(reviews).toHaveLength(0)
        })
    })
    test("blocks queries with invalid categories (not in database) and returns 404, error message", () => {
        return request(app).get('/api/reviews?category=ps5')
        .expect(404)
        .then(({body}) => {
           expect(body).toEqual({msg:"category not found in database"})
        })
    })
    test("will accept valid sort_by argument and sort database in correct fashion", () => {
        return request(app).get('/api/reviews?sort_by=title')
        .expect(200)
        .then(({body:{reviews}}) => {
           expect(reviews).toBeSortedBy('title',{descending:true})
           expect(reviews).toHaveLength(13)
           reviews.forEach((review) => {
            expect(review).toEqual(
                expect.objectContaining({
                    title: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_img_url: expect.any(String),
                    category: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    review_id: expect.any(Number),
                    comment_count: expect.any(String)
                })
            )
           })
        })
    })
    test("sorting by column not in table will return 400 and helpful error message", () => {
        return request(app).get('/api/reviews?sort_by=banana')
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg:"sort_by column not found in database"})
        })
    })
    test("accepts order query, sorts data appropriately into DESC or ASC", () => {
        return request(app).get('/api/reviews?order=asc')
        .expect(200)
        .then(({body:{reviews}}) => {
            expect(reviews).toBeSortedBy("created_at",{ascending:true})
        })
    })
    test("incorrect order value results in 400 and useful error message", () => {
        return request(app).get('/api/reviews?order=banana')
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg: "order by query invalid"})
        })
    })
    test("queries not on the list get ignored and result in default behaviour, 200", () => {
        return request(app).get('/api/reviews?banana=true')
        .expect(200)
        .then(({body:{reviews}}) => {
            expect(reviews).toHaveLength(13)
            expect(reviews).toBeSortedBy("created_at",{descending:true})
            reviews.forEach((review) => {
                expect(review).toEqual(
                    expect.objectContaining({
                        title: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_img_url: expect.any(String),
                        category: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        review_id: expect.any(Number),
                        comment_count: expect.any(String)
                    })
                )
            })
        })
    })
    test("can handle multiple valid queries simultaneously and give correct result", () => {
        return request(app).get('/api/reviews?category=social+deduction&sort_by=owner&order=asc')
        .expect(200)
        .then(({body:{reviews}}) => {
            expect(reviews).toHaveLength(11)
            expect(reviews).toBeSortedBy("owner",{ascending:true})
            reviews.forEach((review) => {
                expect(review).toEqual(
                    expect.objectContaining({
                        title: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_img_url: expect.any(String),
                        category: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        review_id: expect.any(Number),
                        comment_count: expect.any(String)
                    })
                )
            })
        })
    })
    test("if one part of compound query is incorrect, whole query is rejected with appropriate error message", () => {
        return request(app).get('/api/reviews?category=social+deduction&sort_by=banana&order=asc')
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg: "sort_by column not found in database"})
        })
    })
})
