import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import authenticationController, {
  authenticator,
} from "./controllers/authenticationController";
import storiesController from "./controllers/storiesController";
import votesController from "./controllers/votesController";
import notFoundController from "./controllers/notFoundController";
const morgan = require("morgan");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.use(morgan("combined"));
app.use(authenticator);
app.use("/token", authenticationController);
app.use("/stories", storiesController);
app.use("/votes", votesController);
app.use(notFoundController);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
  });
}

export default app;
