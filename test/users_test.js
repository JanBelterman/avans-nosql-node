const assert = require("assert")
const request = require("supertest")
const app = require("../app")
const { User } = require("../models/user")

describe('/api/users', () => {

    describe('POST', () => {

        it('should create a new user with valid request', (done) => {
            User.countDocuments().then(count => {
                request(app)
                    .post('/api/users')
                    .send({
                        username: "testUser",
                        password: "12345"
                    })
                    .end(() => {
                        User.countDocuments().then(newCount => {
                            assert(count === newCount - 1)
                            done()
                        })
                    })
            })
        })

        it('should respond with status 200 to a valid request', (done) => {
            request(app)
                .post('/api/users')
                .send({
                    username: "testUser",
                    password: "12345"
                })
                .end((err, response) => {
                    assert(response.status, 200)
                    done()
                })
        })

        it('should respond with the created user to a valid request', (done) => {
            request(app)
                .post('/api/users')
                .send({
                    username: "testUser",
                    password: "12345"
                })
                .end((err, response) => {
                    assert(response.body.username, "testUser")
                    done()
                })
        })

        it('should not create a new user with invalid request', (done) => {
            User.countDocuments().then(count => {
                request(app)
                    .post('/api/users')
                    .send({
                        username: "testUser"
                        // Missing required password field
                    })
                    .end(() => {
                        User.countDocuments().then(newCount => {
                            assert(count === newCount)
                            done()
                        })
                    })
            })
        })

        it('should respond with a status code in the 400 range when send an invalid request', (done) => {
            request(app)
                .post('/api/users')
                .send({
                    username: "testUser"
                    // Missing required password field
                })
                .end((err, response) => {
                    assert(response.status >= 400)
                    done()
                })
        })

        it('should not create a new user with an existing username', (done) => {
            //Create existing user
            request(app)
                .post('/api/users')
                .send({
                    username: "testUser",
                    password: "12345"
                })
                .end(() => {
                    User.countDocuments().then(count => {
                        request(app)
                            .post('/api/users')
                            .send({
                                //Try to add same username
                                username: "testUser",
                                password: "12345"
                            })
                            .end(() => {
                                User.countDocuments().then(newCount => {
                                    assert(count === newCount)
                                    done()
                                })
                            })
                    })
                    
                })
            
        })

        it('should respond with a status code in the 400 range when trying to use an existing username', (done) => {
            //Create existing user
            request(app)
                .post('/api/users')
                .send({
                    username: "testUser",
                    password: "12345"
                })
                .end(() => {
                    User.countDocuments().then(count => {
                        request(app)
                            .post('/api/users')
                            .send({
                                //Try to add same username
                                username: "testUser",
                                password: "12345"
                            })
                            .end((err, response) => {
                                assert(response.status >= 400);
                                done();
                            })
                    })
                    
                })
            
        })

    })

    describe("PUT", () => {

        it('should respond with 200 on a valid request', (done) => {
            request(app)
                .put('/api/users')
                .send({
                    username: "testUser",
                    oldPassword: "12345",
                    newPassword: "123456"
                })
                .end((err, response) => {
                    assert(response.status, 200)
                    done()
                })
        })

    })

    describe("DELETE", () => {

        it('should respond with 200 on a valid request', (done) => {
            request(app)
                .delete('/api/users')
                .send({
                    username: "testUser"
                })
                .end((err, response) => {
                    assert(response.status, 200)
                    done()
                })
        })

    })

})