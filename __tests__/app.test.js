const request = require('supertest')
let db = require('../db/connection')
let app = require('../app.js')
let seed = require('../db/seeds/seed')

// bring in data from test data files
let testData = require('../db/data/test-data/index.js')

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

// handle any/all incorrect URLs
describe('GET /api/categorys',() => {
    test("check that status 404 is returned",() => {
        return request(app).get('/api/categorys').expect(404)
    })
    test("check that error message is returned, and body matches the exact format expected",() => {
        return request(app).get('/api/categorys')
        .then(({body}) => {
            expect(body).toEqual({msg:"path not found"})
        })
    })
})

// get api/reviews
describe('GET /api/reviews',() => {
    test("check that status 200 is returned",() => {
        return request(app).get('/api/reviews').expect(200)
    })
})