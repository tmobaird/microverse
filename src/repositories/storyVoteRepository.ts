import { PrismaClient, Vote } from "@prisma/client";
import { VoteParams } from "../types";
const prisma = new PrismaClient();

export const getStoryVotes = async (storyId: number): Promise<Vote[]> => {
  const votes = await prisma.vote.findMany({
    where: {
      storyId: storyId,
    },
  });

  return votes;
};

type VoteCounts = {
  _count: { id: number };
  direction: "UP" | "DOWN";
}[];

export const getStoryVoteCounts = async (
  storyId: number,
): Promise<VoteCounts> => {
  const voteCounts = await prisma.vote.groupBy({
    by: ["direction"],
    where: {
      storyId: storyId,
    },
    _count: {
      id: true,
    },
  });

  return voteCounts;
};

export const getStoryVoteByUserId = async (
  storyId: number,
  userId: string,
): Promise<Vote | null> => {
  const vote = await prisma.vote.findFirst({
    where: {
      storyId: storyId,
      userId: userId,
    },
  });

  return vote;
};

export const createStoryVote = async (
  storyId: number,
  voteParams: VoteParams,
): Promise<Vote> => {
  const newVote = await prisma.vote.create({
    data: {
      storyId,
      ...voteParams,
    },
  });

  return newVote;
};
