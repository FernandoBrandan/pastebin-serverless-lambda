import request from 'supertest'

const API = 'http://localhost:3000/local/api/v1'

let token = ''
let pasteId = ''

describe.skip('Paste creation & reading', () => {
    const email = `user${Date.now()}@test.com`
    const password = 'strongPassword123'

    beforeAll(async () => {
        // Registrar usuario
        await request(API).post('/register').send({ email, password })

        // Loguear usuario
        const loginRes = await request(API).post('/login').send({ email, password })
        expect(loginRes.status).toBe(200)
        token = loginRes.body.token
        expect(token).toBeDefined()
    })

    it('should create a paste', async () => {
        const res = await request(API)
            .post('/pastes')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Paste',
                content: 'console.log("hello world");',
                contentType: 'text/javascript',
                expireType: '1d',
                visibility: 'unlisted'
            })

        expect(res.status).toBe(201)
        expect(res.body.pasteId).toBeDefined()
        pasteId = res.body.pasteId
    })

    it('should retrieve the created paste', async () => {
        const res = await request(API).get(`/pastes`).query({ pasteId })
        expect(res.status).toBe(200)
        expect(res.body.content).toContain('console.log("hello world");')
        expect(res.body.title).toBe('Test Paste')
    })
})
