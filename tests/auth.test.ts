import request from "supertest";
import { serverURL } from "./mockdata";
import { testUser } from "../jest.setup";
import TestUser from "./misc/auth";

describe('Authentication Tests', () => {

    test('Register a new user', async () => {
        const newtestuser = {
            username: 'newtestuser',
            email: 'newtestuser@example.com',
            password: 'NewTestPassword123'
        };

        const res = await request(serverURL)
            .post('/api/auth/register')
            .send(newtestuser);
        
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('userId');
    });


    test('Login with existing user', async () => {
        const credentials = {
            email: testUser.email,
            password: testUser.password
        };

        const res = await request(serverURL)
            .post('/api/auth/login')
            .send(credentials);
        
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('refreshToken');
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('userId');

        testUser.accessToken = res.body.token;
        testUser.refreshToken = res.body.refreshToken;
    });

    test('Refresh tokens', async () => {
        const res = await request(serverURL)
            .post('/api/auth/refresh-token')
            .send({ refreshToken: testUser.refreshToken });
        
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('refreshToken');

        testUser.accessToken = res.body.token;
        testUser.refreshToken = res.body.refreshToken;
    });

    test('Login with invalid credentials', async () => {
        const credentials = {
            email: 'invaliduser@example.com',
            password: 'WrongPassword123'
        };

        const res = await request(serverURL)
            .post('/api/auth/login')
            .send(credentials);
        
        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Invalid credentials');
    });

    test('Refresh tokens with invalid token', async () => {
        const res = await request(serverURL)
            .post('/api/auth/refresh-token')
            .send({ refreshToken: 'InvalidRefreshToken' });
        
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Server error');
    });

    test('Refresh tokens with expired token', async () => {

        const res = await request(serverURL)
            .post('/api/auth/refresh-token')
            .send({ refreshToken: testUser.refreshToken });

        const oldRefreshToken = testUser.refreshToken;
        testUser.accessToken = res.body.token;
        testUser.refreshToken = res.body.refreshToken;

        const res2 = await request(serverURL)
            .post('/api/auth/refresh-token')
            .send({ refreshToken: oldRefreshToken });
        
        expect(res2.status).toBe(401);
        expect(res2.body.message).toBe('Invalid refresh token');


        // Re-login to get valid tokens again
        const credentials = {
            email: testUser.email,
            password: testUser.password
        };

        const res3 = await request(serverURL)
            .post('/api/auth/login')
            .send(credentials);

        testUser.accessToken = res3.body.token;
        testUser.refreshToken = res3.body.refreshToken;
    });


    test('Register with existing email', async () => {
        const newUser = new TestUser(
            'testuser2',
            testUser.email,
            'AnotherPassword123'
        );

        const res = await request(serverURL)
            .post('/api/auth/register')
            .send(newUser);
        
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Server error');
    });

});