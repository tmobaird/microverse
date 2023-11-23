import { createImage } from "./repositories/imageRepository";
import { createStory } from "./repositories/storyRepository";

async function main() {
  const storyParams = {
    title: "The Wolf and the Whispering Winds",
    body: "Under the whispering winds of the vast plains, a lone gray wolf stalked the moonlit prairies. Gaunt with hunger, his keen eyes darted across the night, searching for any sign of prey. His plight had endured longer than the lonely cries that escaped his throat, each howl a testament to his fading strength. In the deep stillness of the night, something unfamiliar caught his attention - a faint glimmer of firelight against the sprawling darkness. His instincts whispered caution, but the scent of potential sustenance drew him ever nearer.\n\nAs he neared the quiet campsite, shadows danced on the tents, while embers from the fading fire cracked and popped. The wolf, with a lightness that belied his desperation, moved closer, hoping that the humans had left behind scraps. His silent footsteps were an echo of the life he once knew, when his pack roamed the endless terrain as masters of their dominion.\n\nIn a shelter, woven from the land itself, a Native American man lay awake, burdened by a strange restlessness. His name was Chayton, which meant 'falcon,' and his eyes were as sharp as the raptor's for which he was named. The wolf’s scent stirred Chayton from his bed of furs, his hand moving instinctively to the spear that had served as both his guardian and provider. Standing in the entrance, half merged with darkness, Chayton peered out, sensing the imminent threat. The wolf tensed, feeling the gaze, prepared for a quick retreat.\n\nYet it was not Chayton's presence that fate had aligned, but that of his wife, Wachiwi, 'Dancer.' Drawn from their tent by a force she could not name, her eyes met the wolf’s across the campfire’s dying light. There was no fear in her gaze, only a profound recognition that seemed to transcend the silent boundary between kindred spirits. The connection, electric and peaceful, sparked something ancient and hallowed, a bond between two disparate souls, each recognizing the other as family.\n\nWachiwi extended her hand, her voice a melodic whisper that sung through the stillness, \"You are weary, brother wolf. Come, let us share what we have.\" The wolf’s instincts, honed by survival, hesitated at the edge of trust and necessity. The world seemed to hold its breath as Chayton, caught in the moment, lowered his spear, overcome by the truth in his wife's gentle command.\n\nOver the following weeks, the wolf became a silent sentinel for the family, watching over them as they moved with the rhythms of the land. With the wolf at their side, the plains provided for them with a generous hand, and in return, the wolf thrived, his coat regaining its luster, his eyes their fierce clarity. In daytime, he roamed the edges of their camp, and at night, he nestled close, a guardian beneath the canvas of stars.\n\nSeasons turned, each cycle reinforcing the bond. The wolf, once an outcast, had found his pack in the hearts of those who saw not a beast, but a spirit akin to their own. Together, they faced the challenges that the wild lands presented: storms that raged across the plain, intruders that threatened their peace, and the endless journey in search for life’s necessities.\n\nAs years laced their experiences with memories, the wolf’s journey with the family wove into the stories that the tribe shared around crackling fires. Wachiwi, with silver now lighting her hair, would recount the night when a starved creature found solace in their midst, where apprehension gave way to an unwavering alliance. Chayton would speak of respect, of the shared mantle of protector they held with their silent brother.\n\nIn the end, it was not with a grand gesture that the wolf's time came to a close, but with the quiet dignity of a life well lived among those who had become his world. As he lay for the last time near the fire that had first illuminated the connection between them, Wachiwi knelt by his side. She whispered words of a gentle voyage, her hands smoothing the gray fur that had long since become emblematic of their unorthodox, loving clan.\n\n\"Go now, brother wolf,\" she murmured, her eyes bright with unshed tears. \"Run with the ancestors under eternal skies. You will always be part of our family, forever woven into the fabric of our souls.\"\n\nWith a final shuddering breath, the wolf slipped from the earthly bounds, his essence carried by the whispering winds that had first guided him to the light of a family that would forever cherish his memory. And thus, the wolf's journey, which began in solitary desperation, closed full circle - in the warmth of enduring family bonds, in the heart of a union that was, indeed, meant to be.",
    genreList: "Historical Fiction",
  };

  const story = await createStory(storyParams);
  console.log("Created Story: ", story);

  const imagesParams = [
    {
      url: "https://microverse-story-generator-production.s3.amazonaws.com/020a2ef6-fafc-4de1-9081-60224c0e9dc3.png",
      blobId: "020a2ef6-fafc-4de1-9081-60224c0e9dc3",
      afterParagraph: 0,
      storyId: story.id,
    },
    {
      url: "https://microverse-story-generator-production.s3.amazonaws.com/6b4d2b5f-4ef8-4126-a88c-c7983750dfc3.png",
      blobId: "6b4d2b5f-4ef8-4126-a88c-c7983750dfc3",
      afterParagraph: 9,
      storyId: story.id,
    },
  ];
  const imageOne = await createImage(imagesParams[0]);
  const imageTwo = await createImage(imagesParams[1]);
  console.log("Created Images: ", imageOne, imageTwo);
}

main();
