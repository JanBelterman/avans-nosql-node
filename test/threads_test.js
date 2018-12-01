const assert = require("assert")
const request = require("supertest")
const app = require("../app")
const { User } = require("../models/user")
const { Thread } = require("../models/thread")
const { Comment } = require("../models/comment")

describe('/api/threads', () => {

    let userId, threadId, commentId

    // Add test user (required to create thread)
    beforeEach((done) => {
        const user = new User({ username: "testUser", password: "12345" })
        user.save().then(() => {
            userId = user._id
            done()
        })
    })

    // Create test thread with comment
    beforeEach((done) => {
        const thread = new Thread({ username: "testUser", title: "testTitle", content: "testContent" })
        thread.save().then(() => {
            const comment = new Comment({ username: "testUser", content: "testContent" })
            thread.comments.push(comment)
            commentId = comment._id
            threadId = thread._id
            Promise.all([thread.save(), comment.save()])
                .then(() => {
                    done()
                })
        })
    })

    describe('POST', () => {

        it('should respond 200 on a valid request', (done) => {
            request(app)
                .post('/api/threads')
                .send({
                    username: "testUser",
                    title: "testTitle",
                    content: "testContent"
                })
                .end((err, response) => {
                    assert.equal(response.status, 200)
                    done()
                })
        })

        it('should respond 400 when request body misses a property', (done) => {
            request(app)
                .post('/api/threads')
                .send({
                    username: "testUser1",
                    title: "testTitle"
                    // Missing required content
                })
                .end((err, response) => {
                    assert.equal(response.status, 400)
                    done()
                })
        })

        it('should respond 404 when username does not exist', (done) => {
            User.findByIdAndDelete(userId)
                .then(() => {
                    request(app)
                        .post('/api/threads')
                        .send({
                            username: "testUser1",
                            title: "testTitle",
                            content: "testContent"
                        })
                        .end((err, response) => {
                            assert.equal(response.status, 404)
                            done()
                        })
                })
        })

    })

    describe('PUT', () => {

        it('should respond 200 on a valid request', (done) => {
            request(app)
                .put(`/api/threads/${threadId}`)
                .send({
                    content: "newTestContent"
                })
                .end((err, response) => {
                    assert.equal(response.status, 200)
                    done()
                })
        })

        it('should respond 400 when missing request body property', (done) => {
            request(app)
                .put(`/api/threads/${threadId}`)
                .send({
                })
                .end((err, response) => {
                    assert.equal(response.status, 400)
                    done()
                })
        })

        it('should respond 404 when thread is not found', (done) => {
            Thread.deleteOne({ _id: threadId })
                .then(() => {
                    request(app)
                        .put(`/api/threads/${threadId}`)
                        .send({
                            content: "newTestContent"
                        })
                        .end((err, response) => {
                            assert.equal(response.status, 404)
                            done()
                        })
                })
        })

    })

    describe('DELETE', () => {

        it('should respond 200 on a valid request', (done) => {
            request(app)
                .delete(`/api/threads/${threadId}`)
                .end((err, response) => {
                    assert.equal(response.status, 200)
                    done()
                })
        })

        it('should respond 404 when thread is not found', (done) => {
            Thread.deleteOne({ _id: threadId })
                .then(() => {
                    request(app)
                        .delete(`/api/threads/${threadId}`)
                        .end((err, response) => {
                            assert.equal(response.status, 404)
                            done()
                        })
                })
        })

        it('should delete thread on valid request', (done) => {
            request(app)
                .delete(`/api/threads/${threadId}`)
                .end((err, response) => {
                    Thread.findOne({ _id: threadId }).then((thread) => {
                        assert.equal(thread, null)
                        done()
                    })
                })
        })

        it('should delete all the threads comments on a valid request', (done) => {
            request(app)
                .delete(`/api/threads/${threadId}`)
                .end(() => {
                    Comment.findOne({ _id: commentId }).then((comment) => {
                        assert.equal(comment, null)
                        done()
                    })
                })
        })

    })

    describe('GET ALL', () => {

        it('should respond 200 on a valid request', (done) => {
            request(app)
                .get('/api/threads')
                .end((err, response) => {
                    assert.equal(response.status, 200)
                    done()
                })
        })

        it('should respond with an array on a valid request', (done) => {
            request(app)
                .get('/api/threads')
                .end((err, response) => {
                    assert(Array.isArray(response.body))
                    done()
                })
        })

    })

    describe('GET ALL', () => {

        it('should respond 200 on a valid request', (done) => {
            request(app)
                .get(`/api/threads/${threadId}`)
                .end((err, response) => {
                    assert.equal(response.status, 200)
                    done()
                })
        })

    })

    describe('POST UPVOTE', () => {

        it('should respond 200 with valid request', (done) => {
            request(app)
                .post(`/api/threads/${threadId}/upvotes`)
                .send({ username: "testUser" })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    done()
                })
        })

    })

    describe('POST DOWNVOTE', () => {

        it('should respond 200 with valid request', (done) => {
            request(app)
                .post(`/api/threads/${threadId}/downvotes`)
                .send({ username: "testUser" })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    done()
                })
        })

    })

})