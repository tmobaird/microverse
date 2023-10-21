import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type StoryParams = {
  title: string;
  body: string;
};

export const createStory = async ({ title, body }: StoryParams) => {
  const newStory = await prisma.story.create({
    data: {
      title,
      body,
    },
  });
  return newStory;
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
