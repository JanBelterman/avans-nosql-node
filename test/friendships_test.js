const assert = require("assert")
const request = require("supertest")
const app = require("../app")
const instance = require("../startup/neo4jdb")

describe('/api/friendships', () => {

    before((done) => {
        let session = instance.session()
        session.run(
            'CREATE (:Person {username: "testUser"}), (:Person {username:"testUser2"})'
        ).then(() => {
            done()
        })
    })

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

    describe('DELETE', () => {

        it('should respond 200 with a valid request', (done) => {
            request(app)
                .delete('/api/friendships')
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