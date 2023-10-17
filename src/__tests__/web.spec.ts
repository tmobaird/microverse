import request from "supertest";
import { truncateStories } from "../database";
import { createStory } from "../storyRepository";
import app from "../web";


describe("API", () => {
    beforeEach(async () => {
        await truncateStories()
    });

    afterEach(async () => {
        await truncateStories()
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
})