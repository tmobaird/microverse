import { checkbox, confirm, input, select } from "@inquirer/prompts";
import { Image } from "@prisma/client";
import OpenAI from "openai";
import { generateImage, saveImageToS3 } from "./images";
import { createImage } from "./repositories/imageRepository";
import { createStory } from "./repositories/storyRepository";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface EndingStyle {
  value: string;
  description: string;
}

const endingStyles: EndingStyle[] = [
  {
    value: "resolved",
    description: "that brings the story to a logical close",
  },
  { value: "cliffhanger", description: "that leaves the reader wanting more" },
  {
    value: "mystery",
    description:
      "that leaves the understading of the resolution up for interpretation",
  },
];

interface PromptInput {
  theme: string;
  premise: string;
  genres: string[];
  timePeriod: string;
  location: string;
  endingStyle: EndingStyle;
  ageRange: string;
  additionalKeywords: string;
}

function buildPrompt(input: PromptInput): string {
  const keywords = input.additionalKeywords
    .split(",")
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 0);
  let output = "";
  output += "Write a short story that follows the following prompt:\n";
  output += `The theme of the story should be ${input.theme}. The story should use this premise for inspiration: "${input.premise}"\n`;
  output += `The story should be of the ${input.genres.join(
    ", ",
  )} genre(s), set in the ${input.timePeriod} in ${input.location}.\n`;
  output += `The ending of the story should be a ${input.endingStyle.value}, ${input.endingStyle.description}.\n`;
  output += `The target audience for this story is people ${input.ageRange}.\n`;
  if (keywords.length > 0) {
    output += `The additional descriptors that should influence the plot of the story are: ${keywords.join(
      ", ",
    )}.\n`;
  }
  output += `You can take any creative freedom when writing the story. Avoid calling out the part of the story that the text is in.\n`;
  output +=
    'Try to avoid using phrases like "the story ends on a cliffhanger", or things that explicitly say the literary devices that are being used.\n';
  output +=
    "The story must have a title. The story must be no longer than 750 words.\n\n";
  output +=
    "The result must also be formatted a raw JSON object. The JSON object must have two keys: title and story, both of which are strings. New paragraphs should be encoded as 2 newline characters. Don't wrap the JSON object in anything like quotes or backticks. If quotes using double quote characters are used in the story, they must be escaped.\n";
  return output;
}

interface Story {
  title: string;
  story: string;
}

const generateStory = async (prompt: string): Promise<Story | null> => {
  const chatCompletion = await openai.chat.completions.create({
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are an accomplished short story author who has the ability to write across all genres.",
      },
      { role: "user", content: prompt },
    ],
    model: "gpt-4-1106-preview",
    n: 1,
  });

  if (chatCompletion.choices[0].message.content) {
    try {
      const rawStory = chatCompletion.choices[0].message.content;
      const storyObject = JSON.parse(rawStory) as Story;
      return storyObject;
    } catch (error) {
      console.log(
        "Error parsing story",
        error,
        chatCompletion.choices[0].message.content,
      );
      return null;
    }
  }
  return null;
};

type ImagePrompts = {
  images: {
    prompt: string;
    afterParagraph: number;
  }[];
};

const generateImagePrompts = async (
  storyBody: string,
): Promise<ImagePrompts | null> => {
  const prompt =
    "I am trying to generate two images. The images should be visual representations of the short story.\n" +
    "Generate one prompt for each of the two desired images. Also include the index of the paragraph in the short story that the image should follow. The indexes should be 0 indexed.\n" +
    "The prompts should be follow OpenAI's usage policies, and should not be used to generate overly offensive or illegal content. This means avoid generating prompts that include words similar to murder.\n" +
    "The response must be a JSON object and should follow the following format:\n" +
    JSON.stringify({
      images: [
        {
          prompt: "a gray tabby cat painted as as napoleon",
          afterParagraph: 0,
        },
      ],
    });

  const promptResults = await openai.chat.completions.create({
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: `Here is a short story that was generated that I am looking to create images for: ${storyBody}`,
      },
      { role: "user", content: prompt },
    ],
    model: "gpt-4-1106-preview",
    n: 1,
  });

  if (!promptResults.choices[0].message.content) return null;

  const imageResult = JSON.parse(
    promptResults.choices[0].message.content,
  ) as ImagePrompts;
  return imageResult;
};

type ImageObjectInfo = {
  location: string;
  blobId: string;
  afterParagraph: number;
};

const generateAndStoreImageObjects = async (
  imagePrompts: ImagePrompts,
): Promise<ImageObjectInfo[]> => {
  const images = await Promise.all(
    imagePrompts.images.map(async (imagePrompt) => {
      const contents = await generateImage(imagePrompt.prompt);
      return {
        contents,
        afterParagraph: imagePrompt.afterParagraph,
      };
    }),
  );

  const objects = await Promise.all(
    images.map(async (image) => {
      return saveImageToS3(image.contents[0]);
    }),
  );

  return objects.map((object, i) => {
    return {
      location: object.location,
      blobId: object.blobId,
      afterParagraph: images[i].afterParagraph,
    };
  });
};

const saveImages = async (
  objects: ImageObjectInfo[],
  storyId: number,
): Promise<Image[]> => {
  return await Promise.all(
    objects.map(async (object, i) => {
      return await createImage({
        url: object.location,
        afterParagraph: object.afterParagraph,
        blobId: object.blobId,
        storyId: storyId,
      });
    }),
  );
};

async function main(dryRun = false) {
  try {
    const theme = await input({ message: "Theme" });
    const premise = await input({ message: "Premise" });

    const genres = await checkbox({
      message: "Select genres",
      choices: [
        { value: "romance" },
        { value: "horror" },
        { value: "fantasy" },
        { value: "science fiction" },
        { value: "dystopian" },
        { value: "action + adventure" },
        { value: "mystery" },
        { value: "historical fiction" },
      ],
    });

    const timePeriod = await input({
      message: "Enter time period",
    });
    const location = await input({
      message: "Enter location",
    });
    const endingStyle = await select({
      message: "Select ending style",
      choices: endingStyles.map((endingStyle) => ({
        value: endingStyle,
        name: endingStyle.value,
      })),
    });
    const ageRange = await input({
      message: "Enter age range",
    });
    const additionalKeywords = await input({
      message: "Enter additional keywords (separated by commas)",
    });

    const promptInput: PromptInput = {
      additionalKeywords,
      ageRange,
      endingStyle,
      genres,
      location,
      premise,
      theme,
      timePeriod,
    };

    const prompt = buildPrompt(promptInput);
    console.log("===== Prompt =====");
    console.log(prompt);
    const confirmed = await confirm({ message: "Is this prompt correct?" });
    if (confirmed) {
      const story = await generateStory(prompt);
      if (story) {
        console.log(`===== ${story.title} =====`);
        console.log(story.story);

        const imagePrompts = await generateImagePrompts(story.story);
        if (!imagePrompts) {
          console.log("Error generating image prompts");
          return;
        }
        console.log("===== Image Prompts =====");
        console.log(imagePrompts);
        const objects = await generateAndStoreImageObjects(imagePrompts);
        console.log("===== Image Objects =====");
        console.log(objects);

        const storyGoodToGo = await confirm({
          message: "Is this story sufficient?",
        });
        if (!storyGoodToGo) {
          console.log("Exiting");
          return;
        }
        if (dryRun) {
          console.log("Dry run, not saving story to database");
          return;
        }
        try {
          const createdStory = await createStory({
            title: story.title,
            body: story.story,
            genreList: genres.join(","),
          });
          const images = await saveImages(objects, createdStory.id);
          console.log("Story saved to database", createdStory);
          console.log("Images saved to database", images);
        } catch (error) {
          console.log("Failed to save story or images to database", error);
        }
      } else {
        console.log("Error generating story");
      }
    } else {
      console.log("Exiting");
    }
  } catch (error) {
    console.error(error);
  }
}

main();
