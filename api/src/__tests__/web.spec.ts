import request from "supertest";
import { truncateStories, truncateVotes } from "../database";
import { generateToken } from "../jwtService";
import { createStory } from "../repositories/storyRepository";
import {
  createStoryVote,
  getStoryVoteByUserId,
} from "../repositories/storyVoteRepository";
import { getVote } from "../repositories/voteRepository";
import app from "../web";

describe("API", () => {
  let token: string;
  beforeEach(() => {
    token = generateToken("123");
  });

  beforeEach(async () => {
    await truncateStories();
    await truncateVotes();
  });

  afterEach(async () => {
    await truncateStories();
    await truncateVotes();
  });

  describe("/stories", () => {
    it("returns 200 with story data", async () => {
      const story = await createStory({
        title: "test title",
        body: "test body",
      });

      const response = await request(app)
        .get("/stories")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.stories.length).toBeGreaterThan(0);
      expect(response.body.stories).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: story.id,
          }),
        ]),
      );
      expect(response.body.nextCursor).toBeNull();
    });

    it("returns nextCursor when there are more stories", async () => {
      for (let i = 0; i < 21; i++) {
        await createStory({
          title: `test title ${i}`,
          body: `test body ${i}`,
        });
      }
      const response = await request(app)
        .get("/stories")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.nextCursor).not.toBeNull();
    });
  });

  describe("/stories/:id", () => {
    it("returns 200 with story data", async () => {
      const story = await createStory({
        title: "test title",
        body: "test body",
        genreList: "Action/Adventure,Romance",
      });

      const response = await request(app)
        .get(`/stories/${story.id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(story.id);
      expect(response.body.title).toBe(story.title);
      expect(response.body.body).toBe(story.body);
      expect(response.body.genres).toHaveLength(2);
      expect(response.body.genres).toEqual(["Action/Adventure", "Romance"]);
    });

    it("returns 404 when story does not exist", async () => {
      const response = await request(app)
        .get(`/stories/123`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(404);
    });
  });

  describe("POST /stories/:id/votes", () => {
    it("returns 201 with vote data", async () => {
      const story = await createStory({
        title: "test title",
        body: "test body",
      });

      const response = await request(app)
        .post(`/stories/${story.id}/votes`)
        .send({ direction: "UP" })
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(201);
      expect(response.body.storyId).toBe(story.id);
      expect(response.body.userId).toBe("123");
    });

    it("returns 400 when story does not exist", async () => {
      const response = await request(app)
        .post(`/stories/123/votes`)
        .send({ direction: "UP", user_id: "123" })
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(400);
    });

    it("returns 400 when post data is incorrect", async () => {
      const story = await createStory({
        title: "test title",
        body: "test body",
      });

      const response = await request(app)
        .post(`/stories/${story.id}/votes`)
        .send({ direction: "WRONG" })
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(400);
    });
  });

  describe("PUT /votes/:id", () => {
    it("returns success with vote info", async () => {
      const story = await createStory({
        body: "body",
        title: "title",
      });
      const vote = await createStoryVote(story.id, {
        direction: "UP",
        userId: "123",
      });

      const response = await request(app)
        .put(`/votes/${vote.id}`)
        .send({ direction: "DOWN" })
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.direction).toBe("DOWN");
      expect(response.body.userId).toBe("123");
    });
  });

  describe("DELETE /votes/:id", () => {
    it("returns 204 and deletes vote", async () => {
      const story = await createStory({
        body: "body",
        title: "title",
      });
      let vote: any = await createStoryVote(story.id, {
        direction: "UP",
        userId: "123",
      });

      const response = await request(app)
        .delete(`/votes/${vote.id}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);
      vote = await getStoryVoteByUserId(story.id, "123");
      expect(vote).toBeNull();
    });

    it("returns 401 when attempting to delete another user's vote", async () => {
      const story = await createStory({
        body: "body",
        title: "title",
      });
      let vote: any = await createStoryVote(story.id, {
        direction: "UP",
        userId: "111",
      });

      const tokenTwo = generateToken("222");
      const response = await request(app)
        .delete(`/votes/${vote.id}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${tokenTwo}`);

      expect(response.status).toBe(403);
      vote = await getVote(vote.id);
      expect(vote).not.toBeNull();
    });
  });

  describe("POST /token", () => {
    it("returns a generated token", async () => {
      const response = await request(app)
        .post("/token")
        .send({ username: "admin", password: "password" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        token: expect.any(String),
      });
    });

    it("returns a 401 when credentials are incorrect", async () => {
      const response = await request(app)
        .post("/token")
        .send({ username: "fake", password: "fake" });

      expect(response.status).toBe(401);
    });
  });
});
