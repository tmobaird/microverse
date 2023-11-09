import { PrismaClient, Story } from "@prisma/client";
const prisma = new PrismaClient();

export type StoryParams = {
  title: string;
  body: string;
  genreList?: string;
};

export type UpdateStoryParams = {
  title?: string;
  body?: string;
  genreList?: string;
};

export const createStory = async ({ title, body, genreList }: StoryParams) => {
  const newStory = await prisma.story.create({
    data: {
      title,
      body,
      genreList,
    },
  });
  return newStory;
};

export const updateStory = async (
  id: number,
  { title, body, genreList }: UpdateStoryParams
) => {
  const updatedStory = await prisma.story.update({
    where: {
      id,
    },
    data: {
      title,
      body,
      genreList,
    },
  });
  return updatedStory;
};

export const fetchStory = async (id: number) => {
  const story = await prisma.story.findUnique({
    where: {
      id,
    },
  });

  return story;
};

export const fetchStories = async () => {
  const stories = await prisma.story.findMany({ orderBy: { id: "desc" } });
  return stories;
};

export const fetchStoriesByPage = async (
  cursor: number | null
): Promise<{ stories: Story[]; nextCursor: number | null }> => {
  const take = 20;
  const stories = await prisma.story.findMany({
    take: take,
    skip: cursor ? 1 : 0,
    ...(cursor && { cursor: { id: cursor } }),
    orderBy: { id: "desc" },
  });

  const nextCursor = stories.length < take ? null : stories[take - 1].id;

  return {
    stories,
    nextCursor: nextCursor,
  };
};
