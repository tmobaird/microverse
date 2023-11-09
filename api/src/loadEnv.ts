import fs from "fs";
const dotenv = require("dotenv");

const baseFilePath = __dirname + "/../.env";
const baseFileContent = fs.readFileSync(baseFilePath, "utf8");

const envFilePath =
  __dirname +
  "/../.env" +
  (process.env.NODE_ENV ? "." + process.env.NODE_ENV : "");
const envFileContent = fs.readFileSync(envFilePath, "utf8");

const baseCreds = dotenv.parse(baseFileContent);
const envCreds = dotenv.parse(envFileContent);
dotenv.populate(process.env, { ...baseCreds, ...envCreds });
