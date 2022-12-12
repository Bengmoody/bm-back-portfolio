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

// error handling for bad path
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
            expect(body).toEqual({msg: "review ID is not in correct format"})
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