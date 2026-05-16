import request from 'supertest';


describe('App-service e2e tests', () => {

    it('test e2e', async () => {
        const response = await request().get('/');
        expect(response.status).toBe(200)
        expect(response.body).toBeDefined()
    })
})
