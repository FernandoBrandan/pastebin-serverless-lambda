import request from 'supertest'

const API = 'http://localhost:3000/local/api/v1'

describe('User auth flow', () => {
    const email = `test${Date.now()}@test.com`
    const password = 'securePassword123'

    it('should register a new user', async () => {
        const res = await request(API).post('/register').send({ email, password })
        expect(res.status).toBe(201)
        expect(res.body.message).toBe('User created')
    }, 15000)

    it('should login the user and return a JWT token', async () => {
        const res = await request(API).post('/login').send({ email, password })
        expect(res.status).toBe(200)
        expect(res.body.token).toBeDefined()
    })
})
