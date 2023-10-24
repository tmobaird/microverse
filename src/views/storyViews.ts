import { Story } from "@prisma/client";
import {
  getStoryVoteByUserId,
  getStoryVoteCounts,
} from "../repositories/storyVoteRepository";

export const renderStories = (stories: Story[], userId: string) => {
  return Promise.all(stories.map((story) => renderStory(story, userId)));
};

export const renderStory = async (story: Story, userId: string) => {
  const voteCounts = await getStoryVoteCounts(story.id);
  const myVote = await getStoryVoteByUserId(story.id, userId);

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
