const assert = require("assert")
const request = require("supertest")
const app = require("../app")

describe('/api/friendships', () => {

    describe('POST', () => {

        it('should respond 200 with a valid request', (done) => {
            request(app)
                .post('/api/friendships')
                .send({
                    usernameOne: "testUser1",
                    passwordTwo: "testUser2"
                })
                .end((err, response) => {
                    assert(response.status, 200)
                    done()
                })
        })

    })

})