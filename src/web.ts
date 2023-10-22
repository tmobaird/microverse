import bodyParser from "body-parser";
import express from "express";
import storiesController from "./controllers/storiesController";
import votesController from "./controllers/votesController";

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

app.use("/stories", storiesController);
app.use("/votes", votesController);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
  });
}

export default app;
