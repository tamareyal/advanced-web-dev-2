import request from "supertest";
import PostsModel, { Post } from '../models/posts';
import mongoose from "mongoose";
import { serverURL, posts, PostConcrete } from "./mockdata";
import TestUser from "./misc/auth";


describe("Posts API", () => {
    // Create TestUser for authenticated interaction with the server
    const testUser = new TestUser(
        "PostTester", 
        "posttester@example.com",
        "securePassword123"
    );

    beforeAll(async () => {
        await testUser.registerUser(serverURL);
    });

    test("Create Posts", async () => {
        for (const postData of posts) {
            // TODO: Ensure sender_id is set correctly on post create automatically using the userId provided in side the authentication middleware
            postData.sender_id = testUser.id;
            const res = await request(serverURL)
                .post("/api/posts")
                .set("Authorization", `Bearer ${testUser.accessToken}`)
                .send(postData);
            
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("sender_id");
            expect(res.body.title).toBe(postData.title);
            expect(res.body.content).toBe(postData.content);

            postData._id = res.body._id;
            postData.sender_id = res.body.sender_id;
            postData.createdAt = res.body.createdAt;
            postData.updatedAt = res.body.updatedAt;
        }
    });
});
