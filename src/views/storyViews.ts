import { Story } from "@prisma/client";
import {
  getStoryVoteByUserId,
  getStoryVoteCounts,
} from "../repositories/storyVoteRepository";

export const renderStories = (stories: Story[]) => {
  return Promise.all(stories.map((story) => renderStory(story)));
};

export const renderStory = async (story: Story) => {
  const voteCounts = await getStoryVoteCounts(story.id);
  const myVote = await getStoryVoteByUserId(story.id, "user123");

  return {
    id: story.id,
    title: story.title,
    body: story.body,
    upVotes:
      voteCounts.find((voteCount) => voteCount.direction === "UP")?._count.id ||
      0,
    downVotes:
      voteCounts.find((voteCount) => voteCount.direction === "DOWN")?._count
        .id || 0,
    myVote: myVote,
  };
};
