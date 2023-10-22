import express from "express";
import { fetchStories, fetchStory } from "../repositories/storyRepository";
import { createStoryVote } from "../repositories/storyVoteRepository";
import { renderStories, renderStory } from "../views/storyViews";

const router = express.Router();

router.get("/", async (req, res) => {
  const stories = await fetchStories();
  const data = await renderStories(stories);
  res.send(data);
});

router.get("/:id", async (req, res) => {
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

router.post("/:id/votes", async (req, res) => {
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

export default router;
