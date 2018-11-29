const assert = require("assert")
const request = require("supertest")
const app = require("../app")
const instance = require("../startup/neo4jdb")
const { User } = require("../models/user")

describe('/api/friendships', () => {

    beforeEach(async (done) => {
        let session = instance.session()
        await session.run('CREATE (:Person{username: "testUser1"}), (:Person{username:"testUser2"})')
        const userOne = new User({username: "testUser1", password: "12345"})
        const userTwo = new User({username: "testUser2", password: "12345"})
        await userOne.save()
        await userTwo.save()
        done()
    })

    describe('POST', () => {

        it('should respond 200 with a valid request', (done) => {
            request(app)
                .post('/api/friendships')
                .send({
                    usernameOne: "testUser1",
                    usernameTwo: "testUser2"
                })
                .end(function (err, response) {
                    assert(response.status === 200)
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
                    usernameTwo: "testUser2"
                })
                .end((err, response) => {
                    assert(response.status, 200)
                    done()
                })
        })

    })

})