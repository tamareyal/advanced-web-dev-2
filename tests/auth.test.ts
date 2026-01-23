import request from "supertest";
import { serverURL } from "./mockdata";
import { testUser } from "../jest.setup";
import TestUser from "./misc/auth";
import { AuthenticatedRequest, authenticate, authorizeOwner } from "../middlewares/authMiddleware";
import { Response } from "express";
import authController from "../controllers/authController";
import UserModel from "../models/users";
import { Request } from "express";
import { register } from "ts-node";
import { isEmptyBindingElement } from "typescript";

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


    test('Register a new user with only username and password', async () => {
        const newtestuser = {
            username: 'newtestuser',
            password: 'NewTestPassword123'
        };

        const res = await request(serverURL)
            .post('/api/auth/register')
            .send(newtestuser);
        
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('All fields are required');
    });

    test('Register a new user with only username and email', async () => {
        const newtestuser = {
            username: 'newtestuser',
            email: 'newtestuser@example.com'
        };

        const res = await request(serverURL)
            .post('/api/auth/register')
            .send(newtestuser);
        
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('All fields are required');
    });


    test('Register a new user with only password and email', async () => {
        const newtestuser = {
            password: 'NewTestPassword123',
            email: 'newtestuser@example.com'
        };

        const res = await request(serverURL)
            .post('/api/auth/register')
            .send(newtestuser);
        
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('All fields are required');
    });

    test('Register a new user with only password', async () => {
        const newtestuser = {
            password: 'NewTestPassword123',
        };

        const res = await request(serverURL)
            .post('/api/auth/register')
            .send(newtestuser);
        
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('All fields are required');
    });

    test('Register a new user with only email', async () => {
        const newtestuser = {
            email: 'newtestuser@example.com'
        };

        const res = await request(serverURL)
            .post('/api/auth/register')
            .send(newtestuser);
        
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('All fields are required');
    });

        test('Register a new user with only username', async () => {
        const newtestuser = {
            username: 'newtestuser'
        };

        const res = await request(serverURL)
            .post('/api/auth/register')
            .send(newtestuser);
        
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('All fields are required');
    });


    test('register returns 500 when create throws', async () => {
        const req = {
            body: {
            username: 'user',
            email: 'user@example.com',
            password: 'password',
            },
        } as any;

        const jsonMock = jest.fn();
        const statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        const res = { status: statusMock } as any;

        const createSpy = jest.spyOn(UserModel as any, 'create').mockRejectedValueOnce(new Error('Database failure'));

        await authController.register(req, res);

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ message: 'Server error' }));

        createSpy.mockRestore();
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


    test('Login no email or password', async () => {
        const credentials = {};

        const res = await request(serverURL)
            .post('/api/auth/login')
            .send(credentials);
        
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Username or email and password are required');
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


    test('Refresh tokens without refresh token', async () => {
         const res = await request(serverURL)
        .post('/api/auth/refresh-token')
        .send({}); // no refreshToken provided

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Refresh token is required');

        const newtestuser = {
            username: 'newtestuser2',
            email: 'newtestuser2@example.com',
            password: 'NewTestPassword123'
        };

        const res2 = await request(serverURL)
            .post('/api/auth/register')
            .send(newtestuser);
        
        expect(res2.status).toBe(201);
        expect(res2.body).toHaveProperty('userId');

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
        const user = await UserModel.findById(testUser.id);
        expect(user?.refreshTokens).toEqual([]);


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

    test("returns 401 and 'Token missing' when Bearer header has no token", () => {
        const req = { headers: { authorization: "Bearer " } } as unknown as AuthenticatedRequest;

        const jsonMock = jest.fn();
        const statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        const res = { status: statusMock } as unknown as Response;

        const next = jest.fn();

        authenticate(req, res, next);

        expect(statusMock).toHaveBeenCalledWith(401);
        expect(jsonMock).toHaveBeenCalledWith({ message: "Token missing" });
        expect(next).not.toHaveBeenCalled();
  });

    test("returns 400 and 'Unauthenticated' when req.userId is missing", async () => {
        const model = {
        findById: jest.fn(),
        };

        const middleware = authorizeOwner(model as any, (r: any) => r.owner);

        const req = {
        params: { id: "123" },
        userId: undefined,
        } as any;

        const jsonMock = jest.fn();
        const statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        const res = { status: statusMock } as any;

        const next = jest.fn();

        await middleware(req, res, next);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ message: "Unauthenticated" });
        expect(next).not.toHaveBeenCalled();
        expect(model.findById).not.toHaveBeenCalled();
    });

});