import { Image, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type ImageParams = {
  url: string;
  blobId: string;
  afterParagraph: number;
  storyId: number;
};

export const getImage = async (id: number): Promise<Image | null> => {
  const image = await prisma.image.findFirst({
    where: {
      id: id,
    },
  });

  return image;
};

export const getImagesForStory = async (storyId: number): Promise<Image[]> => {
  const images = await prisma.image.findMany({
    where: {
      storyId: storyId,
    },
  });

  return images;
};

export const createImage = async (imageParams: ImageParams): Promise<Image> => {
  const newImage = await prisma.image.create({
    data: {
      ...imageParams,
    },
  });
  return newImage;
};
