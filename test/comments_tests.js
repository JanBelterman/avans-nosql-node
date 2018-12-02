const assert = require("assert")
const request = require("supertest")
const app = require("../app")
const { User } = require("../models/user")
const { Comment } = require("../models/comment")

describe('/api/comments', () => {

    let commentId
    let username = "testUser"

    // Create a test user & comment in mongodb
    beforeEach(async () => {
        const user = new User({ username: username, password: "12345" })
        await user.save()
        const comment = new Comment({ username: username, content: "testContent" })
        await comment.save()
        commentId = comment._id
    })

    describe('/upvotes', () => {

        it('should respond 200 on a valid request', (done) => {
            request(app)
                .post(`/api/comments/${commentId}/upvotes`)
                .send({
                    username: username
                })
                .end((err, response) => {
                    assert.equal(response.status, 200)
                    done()
                })
        })

        it('should respond 400 when user already upvoted', (done) => {
            Comment.findById(commentId)
                .then((comment) => {
                    comment.upvotes.push(username)
                    comment.save()
                        .then(() => {
                            request(app)
                                .post(`/api/comments/${commentId}/upvotes`)
                                .send({
                                    username: username
                                })
                                .end((err, response) => {
                                    assert.equal(response.status, 400)
                                    done()
                                })
                        })
                })

        })

    })

    describe('/downvotes', () => {

        it('should respond 200 on a valid request', (done) => {
            request(app)
                .post(`/api/comments/${commentId}/downvotes`)
                .send({
                    username: username
                })
                .end((err, response) => {
                    assert.equal(response.status, 200)
                    done()
                })
        })

        it('should respond 400 when user already downvoted', (done) => {
            Comment.findById(commentId)
                .then((comment) => {
                    comment.downvotes.push(username)
                    comment.save()
                        .then(() => {
                            request(app)
                                .post(`/api/comments/${commentId}/downvotes`)
                                .send({
                                    username: username
                                })
                                .end((err, response) => {
                                    assert.equal(response.status, 400)
                                    done()
                                })
                        })
                })

            })

    })

})