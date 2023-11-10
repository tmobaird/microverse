import express from "express";
import {
  deleteVote,
  getVote,
  updateVote,
} from "../repositories/voteRepository";
import asyncHandler from "express-async-handler";

const router = express.Router();

router.put(
  "/:voteId",
  asyncHandler(async (req, res, _) => {
    const voteId = req.params.voteId;
    const { direction } = req.body;
    try {
      const vote = await updateVote(Number(voteId), { direction });
      res.status(200).send(vote);
    } catch (e) {
      res.status(400).send(e);
    }
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const voteId = req.params.id;
    const userId = res.locals.userId;
    try {
      const vote = await getVote(Number(voteId));
      if (vote?.userId !== userId) {
        res.status(403).send();
        return;
      }
      await deleteVote(Number(voteId));
      res.status(204).send();
    } catch (e) {
      res.status(400).send(e);
    }
  }),
);

export default router;
