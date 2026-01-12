import request from "supertest";
import { serverURL, posts } from "./mockdata";
import { testUser } from "../jest.setup";


describe("Posts API", () => {


    test("Create Posts", async () => {
        for (const postData of posts) {
            const res = await request(serverURL)
                .post("/api/posts")
                .set("Authorization", `Bearer ${testUser.accessToken}`)
                .send(postData);
            
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("sender_id");
            expect(res.body.title).toBe(postData.title);
            expect(res.body.content).toBe(postData.content);
            expect(res.body.sender_id).toBe(testUser.id);

            postData._id = res.body._id;
            postData.sender_id = res.body.sender_id;
            postData.createdAt = res.body.createdAt;
            postData.updatedAt = res.body.updatedAt;
        }
    });

    test("Update a Post", async () => {
        const postToUpdate = posts[0];
        const updatedContent = {
            title: "Updated First Post",
            content: "This is the updated content of the first post."
        };
        
        const res = await request(serverURL)
            .put(`/api/posts/${postToUpdate._id}`)
            .set("Authorization", `Bearer ${testUser.accessToken}`)
            .send(updatedContent);

        expect(res.status).toBe(200);
        expect(res.body.title).toBe(updatedContent.title);
        expect(res.body.content).toBe(updatedContent.content);

        posts[0].title = res.body.title;
        posts[0].content = res.body.content;
        posts[0].updatedAt = res.body.updatedAt;
    });
});
