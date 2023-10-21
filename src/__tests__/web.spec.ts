import request from "supertest";
import { truncateStories, truncateVotes } from "../database";
import { createStory } from "../storyRepository";
import app from "../web";


describe("API", () => {
    beforeEach(async () => {
        await truncateStories()
        await truncateVotes()
    });

    afterEach(async () => {
        await truncateStories()
        await truncateVotes()
    });

    describe("/stories", () => {
        it("returns 200 with story data", async () => {
            const story = await createStory({
                title: "test title",
                body: "test body",
            })

            const response = await request(app).get('/stories')

            expect(response.status).toBe(200)
            expect(response.body.length).toBeGreaterThan(0)
            expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining(
                {
                    id: story.id
                }
            )]))
        })
    })

    describe("/stories/:id", () => {
        it("returns 200 with story data", async () => {
            const story = await createStory({
                title: "test title",
                body: "test body",
            })

            const response = await request(app).get(`/stories/${story.id}`)
            expect(response.status).toBe(200)
            expect(response.body.id).toBe(story.id)
        })

        it("returns 404 when story does not exist", async () => {
            const response = await request(app).get(`/stories/123`)
            expect(response.status).toBe(404)
        })
    })

    describe("POST /stories/:id/votes", () => {
        it("returns 201 with vote data", async () => {
            const story = await createStory({
                title: "test title",
                body: "test body",
            })
            
            const response = await request(app)
                                    .post(`/stories/${story.id}/votes`)
                                    .send({ direction: "UP", user_id: "123" })
                                    .set('Accept', 'application/json')
            expect(response.status).toBe(201)
            expect(response.body.storyId).toBe(story.id)
        })

        it("returns 400 when story does not exist", async () => {
            const response = await request(app)
                                    .post(`/stories/123/votes`)
                                    .send({ direction: "UP", user_id: "123" })
                                    .set('Accept', 'application/json')
            expect(response.status).toBe(400)
        })

        it("returns 400 when post data is incorrect", async () => {
            const story = await createStory({
                title: "test title",
                body: "test body",
            })
            
            const response = await request(app)
                                    .post(`/stories/${story.id}/votes`)
                                    .send({ direction: "WRONG" })
                                    .set('Accept', 'application/json')
            expect(response.status).toBe(400)
        })
    })
})