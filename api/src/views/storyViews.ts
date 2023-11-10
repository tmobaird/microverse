import { Image, Story } from "@prisma/client";
import { getImagesForStory } from "../repositories/imageRepository";
import {
  getStoryVoteByUserId,
  getStoryVoteCounts,
} from "../repositories/storyVoteRepository";

export const renderStories = (
  stories: Story[],
  userId: string,
  nextCursor: number | null,
) => {
  return Promise.all(
    stories.map((story) => renderStory(story, userId, false)),
  ).then((renderedStories) => {
    return {
      stories: renderedStories,
      nextCursor,
    };
  });
};

export const renderStory = async (
  story: Story,
  userId: string,
  detailed: boolean = true,
) => {
  const voteCounts = await getStoryVoteCounts(story.id);
  const myVote = await getStoryVoteByUserId(story.id, userId);
  let images: Image[] = [];

  let genres: string[] = [];
  if (story.genreList) {
    genres = story.genreList.split(",");
  }

  if (detailed) {
    images = await getImagesForStory(story.id);
  }

  return {
    id: story.id,
    title: story.title,
    ...(detailed ? { body: story.body } : {}),
    ...(detailed ? { images: images } : {}),
    genres: genres,
    upVotes:
      voteCounts.find((voteCount) => voteCount.direction === "UP")?._count.id ||
      0,
    downVotes:
      voteCounts.find((voteCount) => voteCount.direction === "DOWN")?._count
        .id || 0,
    myVote: myVote,
  };
};
