import express from "express";
import { fetchStories, fetchStory } from "./storyRepository";

const app = express();
const port = process.env.PORT || 8080;

app.get("/stories", async (req, res) => {
    const stories = await fetchStories()
    res.send(stories);
})

app.get("/stories/:id", async (req, res) => {
    const storyId = req.params.id
    let status = 200
    let data: any = {}

    if (!storyId) {
        status = 400
        data = "Missing story id"
    }

    const story = await fetchStory(Number(storyId))
    data = story

    if (!story) {
        status = 404
        data = "Story not found"
    }

    res.status(status).send(data)
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`server started at http://localhost:${port}`);
    });
}

export default app;