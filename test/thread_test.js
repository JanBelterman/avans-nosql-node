const assert = require("assert")
const request = require("supertest")
const app = require("../app")
const { Thread } = require("../models/thread")

describe('/api/threads', () => {

    describe('POST', () => {

        it('should create a new thread with a valid request', (done) => {
            Thread.countDocuments().then(count => {
                request(app)
                    .post('api/threads')
                    .send({
                        poster: "testUser",
                        title: "Thread Test Title",
                        content: "This is the content of the test thread."
                    })
                    .end(() => {
                        Thread.countDocuments().then(newCount => {
                            console.log(count + " " +  newCount);
                            
                            assert(count === newCount -1)
                            done()
                        })
                    })
            })
        })

        it('should respond with status 200 with a valid request', (done) => {
            request(app)
                .post('api/threads')
                .send({
                    poster: "testUser",
                    title: "Thread Test Title",
                    content: "This is the content of a test thread."
                })
                .end((err, response) => {
                    assert(response.status, 200)
                    done()
                })
        })

        it('should respond with the created thread for a valid request', (done) => {
            request(app)
                .post('api/threads')
                .send({
                    poster: "testUser",
                    title: "Thread Test Title",
                    content: "This is the content of a test thread."
                })
                .end((err, response) => {
                    assert(response.body.poster, 'testUser')
                    assert(response.body.title, 'Thread Test Title')
                    assert(request.body.content, 'This is the content of a test thread.')
                    done()
                })
        })

        it('should respond with status in 400 range with a invalid request', (done) => {
            request(app)
                .post('api/threads')
                .send({
                    poster: "testUser",
                    //missing title and content
                })
                .end((err, response) => {
                    assert(response.status >= 400)
                    assert(response.status < 500)
                    done()
                })
        })
    })

    describe('GET', () => {
        
    })
})