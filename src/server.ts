import dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";

import { corsOption } from "./config/corsOprion";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT, 10) || 8081;

const app: Express = express();

app.use(cors(corsOption));

app.use(express.urlencoded({ extended: true })); // used to get data from URL / form data

app.use(express.json()); // used to get data from JSON type

app.use(helmet());

app.listen(PORT, () =>
  console.log(`Server is up and running on port : ${PORT}`)
);
