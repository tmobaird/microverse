import { fetchStory } from "./repositories/storyRepository";

async function main(id: number) {
  const story = await fetchStory(id);
  if (story) {
    console.log(`=== ${story.title} ===`);
    console.log(`Created At: ${story.createdAt}`);
    console.log(`Updated At: ${story.updatedAt}`);
    console.log("---");
    console.log(story.body);
  } else {
    console.log("Story not found");
  }
}

const id = Number(process.argv[process.argv.length - 1]);
if (id && !isNaN(id)) {
  main(id);
} else {
  main(1);
}
