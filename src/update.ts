import { confirm, input, select } from "@inquirer/prompts";
import { fetchStories, updateStory } from "./repositories/storyRepository";

const updateStoryFlow = async () => {
  const stories = await fetchStories();
  if (stories) {
    const targetStory = await select({
      message: "Select story",
      choices: stories.map((story) => ({
        value: story,
        name: `#${story.id}: ${story.title}`,
      })),
    });

    const fieldToUpdate = await select({
      message: "Select field to update",
      choices: [{ value: "title" }, { value: "body" }, { value: "genreList" }],
    });

    const newValue = await input({
      message: `Enter new ${fieldToUpdate}`,
    });

    try {
      const updatedStory = await updateStory(targetStory.id, {
        [fieldToUpdate]: newValue,
      });
      console.log("Story updated", updatedStory);
    } catch (e) {
      console.log("Failed to update story", e);
    }
  } else {
    console.log("Failed to load stories");
  }
};

async function main() {
  let run = true;
  while (run) {
    await updateStoryFlow();
    const keepGoing = await confirm({
      message: "Update another story?",
    });

    if (!keepGoing) {
      run = false;
    }
  }
}

main();
