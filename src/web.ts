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
    if (!storyId) res.status(400).send("Missing story id")
    const story = await fetchStory(Number(storyId))
    if (!story) res.status(404).send("Story not found")
    res.send(story)
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});