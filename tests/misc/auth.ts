import request from 'supertest';

class TestUser {
    id?: string;
    username: string;
    email: string;
    password: string;
    accessToken?: string;
    refreshToken?: string;

    constructor(username: string, email: string, password: string, accessToken?: string, refreshToken?: string) {
        this.username = username || 'testuser';
        this.email = email || 'testuser@example.com';
        this.password = password || 'password123';
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    async registerUser(serverURL: string): Promise<[accessToken: string, refreshToken: string]> {
        const res = await request(serverURL).post("/api/auth/register").send({
            username: this.username,
            email: this.email,
            password: this.password
        });
        if (res.status !== 201) {
            throw new Error(`Failed to register user: ${res.status} - ${res.text}`);
        }
        const accessToken = res.body.token;
        const refreshToken = res.body.refreshToken;

        this.id = res.body.userId;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;

        return [accessToken, refreshToken];
    }

    async refreshTokens(serverURL: string): Promise<[newAccessToken: string, newRefreshToken: string]> {
        if (!this.refreshToken) {
            throw new Error("No refresh token available. Please register the user first.");
        }

        const res = await request(serverURL).post("/api/auth/refresh-token").send({
            refreshToken: this.refreshToken
        });
        if (res.status !== 200) {
            throw new Error(`Failed to refresh tokens: ${res.status} - ${res.text}`);
        }
        const newAccessToken = res.body.token;
        const newRefreshToken = res.body.refreshToken;

        this.accessToken = newAccessToken;
        this.refreshToken = newRefreshToken;

        return [newAccessToken, newRefreshToken];
    }
}

export default TestUser;