const request = require('supertest');
const app = require('../../../src/app');
const connection = require('../../../src/database/connection');

describe('ONG CRUD', () => {
    beforeAll(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    let createdOngId;
    it('should be able to create a new ONG', async () => {
        const response = await request(app)
            .post('/ongs')
            .send({
                name: 'Name',
                email: 'email@email.com',
                whatsapp: '1212345678',
                city: 'City',
                uf: 'UF'
            });
        
        expect(response.body).toHaveProperty('login');
        expect(response.body.login).toHaveLength(8);
        createdOngId = response.body.login;
    });

    it('should be able to read the new ONG', async () => {
        const response = await request(app).get('/ongs');
        
        expect(response.body).toContainEqual({
            id: createdOngId,
            name: 'Name',
            email: 'email@email.com',
            whatsapp: '+551212345678',
            city: 'City',
            uf: 'UF'
        });
    });
});
