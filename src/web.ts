import bodyParser from "body-parser";
import express from "express";
import { fetchStories, fetchStory } from "./storyRepository";
import { createStoryVote } from "./storyVoteRepository";
import { renderStories, renderStory } from "./views/storyViews";

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

app.get("/stories", async (req, res) => {
  const stories = await fetchStories();
  const data = await renderStories(stories)
  res.send(data);
});

app.get("/stories/:id", async (req, res) => {
  const storyId = req.params.id;
  let status = 200;
  let data: any = {};

  if (!storyId) {
    status = 400;
    data = "Missing story id";
  }

  const story = await fetchStory(Number(storyId));

  if (story) {
    data = await renderStory(story);
  }

  if (!story) {
    status = 404;
    data = "Story not found";
  }

  res.status(status).send(data);
});

app.post("/stories/:id/votes", async (req, res) => {
  const storyId = req.params.id;
  const { direction, userId } = req.body;

  try {
    const vote = await createStoryVote(Number(storyId), { userId, direction });
    res.status(201).send(vote);
    return;
  } catch (e) {
    res.status(400).send(e);
  }
});

app.put("/votes/:voteId", async (req, res) => {
  const voteId = req.params.voteId;
  // update vote
});

app.delete("/votes/:id", async (req, res) => {
  const voteId = req.params.id;
  // delete vote
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
  });
}

export default app;
