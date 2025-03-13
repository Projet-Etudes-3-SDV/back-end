import request from 'supertest';
import app from '../src/app';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe('API Tests', () => {

    it('Devrait créer un utilisateur', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({ 
                lastName: "Test",
                firstName: "User",
                email: "test@example.com",
                password: "MotDePasse123!",
                phone: "+33612345678"
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
    });
});
