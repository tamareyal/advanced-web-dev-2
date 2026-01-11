import request from 'supertest';

class TestUser {
    name: string;
    email: string;
    password: string;
    accessToken?: string;
    refreshToken?: string;

    constructor(name: string, email: string, password: string, accessToken?: string, refreshToken?: string) {
        this.name = name || 'testuser';
        this.email = email || 'testuser@example.com';
        this.password = password || 'password123';
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    async registerUser(): Promise<[accessToken: string, refreshToken: string]> {
        const res = await request("localhost:3000").post("/api/auth/register").send({
            name: this.name,
            email: this.email,
            password: this.password
        });
        const accessToken = res.body.accessToken;
        const refreshToken = res.body.refreshToken;

        this.accessToken = accessToken;
        this.refreshToken = refreshToken;

        return [accessToken, refreshToken];
    }

    async refreshTokens(): Promise<[newAccessToken: string, newRefreshToken: string]> {
        if (!this.refreshToken) {
            throw new Error("No refresh token available. Please register the user first.");
        }

        const res = await request("localhost:3000").post("/api/auth/refresh-token").send({
            refreshToken: this.refreshToken
        });
        const newAccessToken = res.body.accessToken;
        const newRefreshToken = res.body.refreshToken;

        this.accessToken = newAccessToken;
        this.refreshToken = newRefreshToken;

        return [newAccessToken, newRefreshToken];
    }
}

export default TestUser;