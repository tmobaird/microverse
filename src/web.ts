import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import storiesController from "./controllers/storiesController";
import votesController from "./controllers/votesController";

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

const getUserId = (req: Request) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const id = authorization.split(" ")[1];
    return id;
  }
  return null;
};

const authenticator = function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = getUserId(req);
  res.locals.userId = userId;
  if (userId === null) {
    res.status(401).send();
    return;
  }
  next();
};

app.use(authenticator);
app.use("/stories", storiesController);
app.use("/votes", votesController);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
  });
}

export default app;
