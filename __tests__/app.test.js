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

// error handling
describe('error handling for wrong path (only possible error so far)',() => {
    test("GET /api/banana",() => {
        return request(app).get('/api/banana')
        .expect(400)
        .then(({body}) => {
            expect(body).toEqual({msg:"path not found"})
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
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        review_id: expect.any(Number)
                    })
                )
            })
        })
    })
    test("check comments are sorted with most recent first",() => {
        return request(app).get('/api/reviews/2/comments')
        .expect(200)
        .then(({body: {comments}}) => {
            console.log(comments)
            expect(comments).toBeSortedBy('created_at',{descending:true})
            
        })
    })
    // test("check that status 404 and helpful message provided when review has no comments",() => {
    //     return request(app).get('/api/reviews/1/comments')
    //     .expect(404)
    //     .then(({body}) => {
    //         expect(body).toBe({msg:"no comments found for this review ID"})
          
    //     })
    // })
})