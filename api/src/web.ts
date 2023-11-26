import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import authenticationController from "./controllers/authenticationController";
import storiesController from "./controllers/storiesController";
import votesController from "./controllers/votesController";
const morgan = require("morgan");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.use(morgan("combined"));
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.contentType = req.header("Content-Type") || "text/html";
  next();
});
// app.use(authenticator);
app.use("/token", authenticationController);
app.use("/stories", storiesController);
app.use("/votes", votesController);

app.get("/", function (req, res) {
  res.render("pages/index");
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
  });
}

export default app;
