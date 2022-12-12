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
    test("check that status 200 is returned",() => {
        return request(app).get('/api/reviews').expect(200)
    })
    test("check that response is an array of objects",() => {
        return request(app).get('/api/reviews')
        .then(({body:{reviews}}) => {
            expect(Array.isArray(reviews)).toBe(true);
            expect(reviews.every((review) => {
                return typeof review === "object"
            })).toBe(true);
        })
    })
    test("check that the structure of the results is correct",() => {
        return request(app).get('/api/reviews')
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
        })
    })
    test("check that the data is sorted by date in ascending order",() => {
        return request(app).get('/api/reviews')
        .then(({body:{reviews}}) => {
            expect(reviews).toBeSortedBy('created_at',{ascending:true})
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