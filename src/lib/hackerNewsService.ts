import axios from "axios";
import { prisma } from "./prisma";

const HN_API = "https://hacker-news.firebaseio.com/v0";

export const fetchAndStoreTopStories = async () => {
  const { data: storyIds } = await axios.get<number[]>(
    `${HN_API}/topstories.json`
  );
  const top10Ids = storyIds.slice(0, 10);

  for (const id of top10Ids) {
    const { data: story } = await axios.get(`${HN_API}/item/${id}.json`);
    if (!story) continue;

    await prisma.story.upsert({
      where: { id: story.id },
      update: {
        title: story.title,
        by: story.by,
        score: story.score,
        descendants: story.descendants || 0,
        url: story.url || null,
      },
      create: {
        id: story.id,
        title: story.title,
        by: story.by,
        score: story.score,
        descendants: story.descendants || 0,
        url: story.url || null,
      },
    });
  }
};
