import express, { NextFunction, Request, Response } from "express";
import { decodeToken, generateToken } from "../jwtService";
const jwt = require("jsonwebtoken");

export const authenticator = function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.path.includes("/token")) {
    next();
    return;
  }

  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).send();
  }

  try {
    const token = authHeader.split("Bearer ")[1];
    const decoded = decodeToken(token);
    res.locals.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).send();
  }
};

const router = express.Router();
router.post("/", (req, res) => {
  const { username, password, userId } = req.body;

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    res.status(401).send({ message: "Invalid credentials" });
    return;
  }

  const token = generateToken(userId);
  res.json({ token });
});

router.post("/decode", (req, res) => {
  const { token } = req.body;
  try {
    const decoded = decodeToken(token);
    res.json({ decoded });
  } catch (error) {
    res.status(401).send({ message: "Invalid token" });
  }
});

export default router;
