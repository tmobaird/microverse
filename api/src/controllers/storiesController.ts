import express from "express";
import asyncHandler from "express-async-handler";
import {
  fetchStories,
  fetchStoriesByPage,
  fetchStory,
} from "../repositories/storyRepository";
import { createStoryVote } from "../repositories/storyVoteRepository";
import { renderStories, renderStory } from "../viewHelpers/storyViewHelpers";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res, _) => {
    const { cursor } = req.query;
    let c = null;
    if (cursor) {
      c = Number(cursor);
    }
    const { stories, nextCursor } = await fetchStoriesByPage(c);
    const userId = res.locals.userId;
    const data = await renderStories(stories, userId, nextCursor);
    res.send(data);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res, _) => {
    const storyId = req.params.id;
    const userId = res.locals.userId;
    let status = 200;
    let data: any = {};

    if (!storyId) {
      status = 400;
      data = "Missing story id";
    }

    const story = await fetchStory(Number(storyId));

    if (story) {
      data = await renderStory(story, userId);
    }

    if (!story) {
      status = 404;
      data = "Story not found";
    }

    if (req.accepts("html")) {
      res.render("pages/story", { story: data });
    } else {
      res.status(status).send(data);
    }
  }),
);

router.post(
  "/:id/votes",
  asyncHandler(async (req, res, _) => {
    const storyId = req.params.id;
    const { direction } = req.body;
    const userId = res.locals.userId;

    try {
      const vote = await createStoryVote(Number(storyId), {
        userId,
        direction,
      });
      res.status(201).send(vote);
      return;
    } catch (e) {
      res.status(400).send(e);
    }
  }),
);

export default router;
