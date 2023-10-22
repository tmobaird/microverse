import express from "express";
import { deleteVote, updateVote } from "../repositories/voteRepository";

const router = express.Router();

router.put("/:voteId", async (req, res) => {
  const voteId = req.params.voteId;
  const { direction } = req.body;
  try {
    const vote = await updateVote(Number(voteId), { direction });
    res.status(200).send(vote);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/:id", async (req, res) => {
  const voteId = req.params.id;
  try {
    await deleteVote(Number(voteId));
    res.status(204).send();
  } catch (e) {
    res.status(400).send(e);
  }
});

export default router;
