const assert = require("assert")
const request = require("supertest")
const app = require("../app")
const instance = require("../startup/neo4jdb")
const { User } = require("../models/user")

describe('/api/friendships', () => {

    // Create 2 test users in both mongodb & neo4j
    beforeEach((done) => {
        // let session = instance.session()
        // await session.run('CREATE (:Person{username: "testUser1"}), (:Person{username:"testUser2"})')
        // const userOne = new User({ username: "testUser1", password: "12345" })
        // const userTwo = new User({ username: "testUser2", password: "12345" })
        // await userOne.save()
        // await userTwo.save()

        let session = instance.session()
        session.run('CREATE (:Person{username: "testUser1"}), (:Person{username:"testUser2"})').then(() => {
            const userOne = new User({ username: "testUser1", password: "12345" })
            const userTwo = new User({ username: "testUser2", password: "12345" })
            userOne.save().then(() => {
                userTwo.save().then(() => {

                    done();
                })
            })
        })
    })

    describe('POST', () => {

        it('should respond 200 with a valid request', (done) => {
            request(app)
                .post('/api/friendships')
                .send({
                    usernameOne: "testUser1",
                    usernameTwo: "testUser2"
                })
                .end((err, response) => {
                    assert(response.status === 200)
                    done()
                })
        })

        it('should create a new friendship with a valid request', (done) => {
            request(app)
                .post('/api/friendships')
                .send({
                    usernameOne: "testUser1",
                    usernameTwo: "testUser2"
                })
                .end(() => {
                    let session = instance.session()
                    session.run('MATCH (:Person{username: "testUser1"})-[:friendsWith]-(p:Person) RETURN p')
                        .then((result) => {
                            const name = result.records[0]._fields[0].properties.username
                            assert(name === 'testUser2')
                            done()
                        })
                })
        })

        it('should respond 200 with double friend requests', (done) => {
            request(app)
                .post('/api/friendships')
                .send({
                    usernameOne: "testUser1",
                    usernameTwo: "testUser2"
                })
                .end(() => {
                    request(app)
                        .post('/api/friendships')
                        .send({
                            usernameOne: "testUser1",
                            usernameTwo: "testUser2"
                        })
                        .end((err, res) => {
                            assert(res.status === 200);
                            done();
                        })
                })
        })

    })

    describe('DELETE', () => {

        // Create friendship in neo4j
        beforeEach((done) => {
            let session = instance.session()
            session.run(
                'MATCH (p1:Person{username: "testUser1"}), (p2:Person{username:"testUser2"})' +
                'MERGE (p1)-[:friendsWith]->(p2)')
                .then(() => {
                    done();
                })
        })

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

        it('should delete friendship with valid request', (done) => {
            request(app)
                .delete('/api/friendships')
                .send({
                    usernameOne: "testUser1",
                    usernameTwo: "testUser2"
                })
                .end((err, response) => {
                    let session = instance.session()
                    session.run('MATCH (:Person{username: "testUser1"})-[:friendsWith]-(p:Person) RETURN p')
                        .then((result) => {
                            assert(result.records[0] === undefined)
                            done()
                        })
                })
        })

        it('should respond with status code 200 when deleting a non-existing friendship', (done) => {
            request(app)
                .delete('/api/friendships')
                .send({
                    usernameOne: "testUser1",
                    usernameTwo: "testUser2"
                })
                .end(() => {
                    request(app)
                        .delete('/api/friendships')
                        .send({
                            usernameOne: "testUser1",
                            usernameTwo: "testUser2"
                        })
                        .end((err, res) => {
                            assert(res.status === 200);
                            done();
                        })
                })
        })

    })

})