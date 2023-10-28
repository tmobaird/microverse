import { checkbox, confirm, input, select } from "@inquirer/prompts";
import OpenAI from "openai";
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
  output += `The theme of the story should be ${input.theme}.\n`;
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
    "The result must also be formatted a raw JSON object. The JSON object must have two keys: title and story, both of which are strings. Don't wrap the JSON object in anything like quotes or backticks. If quotes using double quote characters are used in the story, they must be escaped.\n";
  return output;
}

interface Story {
  title: string;
  story: string;
}

const generateStory = async (prompt: string): Promise<Story | null> => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are an accomplished short story author who has the ability to write across all genres.",
      },
      { role: "user", content: prompt },
    ],
    model: "gpt-3.5-turbo",
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

async function main() {
  try {
    const theme = await input({ message: "Theme" });

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
        try {
          const createdStory = await createStory({
            title: story.title,
            body: story.story,
            genreList: genres.join(","),
          });
          console.log("Story saved to database", createdStory);
        } catch (error) {
          console.log("Failed to save story to database", error);
        }
        console.log();
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
