import { PrismaClient, Vote } from "@prisma/client";
import { VoteParams } from "../types";
const prisma = new PrismaClient();

export const getVote = async (voteId: number): Promise<Vote | null> => {
  const vote = await prisma.vote.findFirst({
    where: {
      id: voteId,
    },
  });

  return vote;
};

export const updateVote = async (
  voteId: number,
  voteParams: VoteParams,
): Promise<Vote> => {
  const updatedVote = await prisma.vote.update({
    where: {
      id: voteId,
    },
    data: {
      ...voteParams,
    },
  });

  return updatedVote;
};

export const deleteVote = (voteId: number): Promise<Vote> => {
  return prisma.vote.delete({
    where: {
      id: voteId,
    },
  });
};
