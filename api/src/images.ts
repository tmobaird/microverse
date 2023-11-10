import OpenAI from "openai";
import { Image } from "openai/resources/images.mjs";
import { v4 as uuidv4 } from "uuid";
import { saveObject } from "./repositories/s3Repository";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateImage = async (prompt: string): Promise<Image[]> => {
  const image = await openai.images.generate({
    prompt: prompt,
    n: 1,
    quality: "standard",
    size: "1024x1024",
    model: "dall-e-3",
    response_format: "b64_json",
  });

  return image.data;
};

export const saveImageToS3 = async (
  image: Image,
): Promise<{ location: string; blobId: string }> => {
  if (!image.b64_json) throw new Error("No image data");

  const objectName = uuidv4();
  const location = await saveObject(image.b64_json, objectName);
  return {
    location,
    blobId: objectName,
  };
};
