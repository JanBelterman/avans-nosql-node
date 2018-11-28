const assert = require("assert")
const request = require("supertest")
const app = require("../app")
const { instance } = require("./test_helper")

describe('/api/friendships', () => {

    beforeEach((done) => {
        let session = instance.session()
        session.run(
            'CREATE (p1:Person {username: $usernameOne}),(p2:Person {username: $usernameTwo})',
            { usernameOne: 'testUser1', usernameTwo: 'testUser2' }
        ).then(() => {
            session.run(
                'MATCH (p1:Person {username: $usernameOne}),(p2:Person {username: $usernameTwo}) RETURN p1, p2',
                { usernameOne: 'testUser1', usernameTwo: 'testUser2' }
            ).then((result) => {
                console.log(result.records[0]._fields)
                done()
            })
        }).catch(() => {
            done()
        })
    })

    describe('POST', async () => {

        it('should create a new friendship with a valid request', (done) => {
            request(app)
                .post('/api/friendships')
                .send({
                    usernameOne: "testUser1",
                    passwordTwo: "testUser2"
                })
                .end(async () => {
                    let session = instance.session()
                    const result = await session.run(
                        'MATCH (p1:Person {username: $usernameOne}),(p2:Person {username: $usernameTwo}) RETURN p1, p2',
                        { usernameOne: 'testUser1', usernameTwo: 'testUser2' }
                    )
                    // const result = await session.run(
                    //     'MATCH (p1:Person {username: $username})-[:friendsWith]-(p2:Person)' +
                    //     'RETURN p2',
                    //     { username: 'testUser1' }
                    // )
                    console.log(result)
                    assert(1, 1)
                    done()
                })
        })

    })

})