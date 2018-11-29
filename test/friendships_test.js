const assert = require("assert")
const request = require("supertest")
const app = require("../app")
const instance = require("../startup/neo4jdb")

describe('/api/friendships', () => {

    before((done) => {
        let session = instance.session()
        session.run(
            'CREATE (:Person {username: "testUserFriendShips1"}), (:Person {username:"testUserFriendShips2"})'
        ).then(() => {
            done()
        })
    })

    describe('POST', () => {

        it('should respond 200 with a valid request', (done) => {
            request(app)
                .post('/api/friendships')
                .send({
                    usernameOne: "testUserFriendShips1",
                    passwordTwo: "testUserFriendShips2"
                })
                .end(function(err, response) {
                    let session = instance.session()
                    session.run(
                        'MATCH (p1:Person{username: "testUserFriendShips1"})-[:friendsWith]-(p2:Person) RETURN p2'
                    ).then((result) => {
                        console.log(result)
                        assert(response.status, 200)
                        done()
                    })
                })
        })

    })

    describe('DELETE', () => {

        it('should respond 200 with a valid request', (done) => {
            request(app)
                .delete('/api/friendships')
                .send({
                    usernameOne: "testUserFriendShips1",
                    passwordTwo: "testUserFriendShips2"
                })
                .end((err, response) => {
                    assert(response.status, 200)
                    done()
                })
        })

    })

})