import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";

import { corsOption } from "./config/corsOprion";
import authRoutes from "./routes/authRoutes";
import superAdminRouter from "./routes/superAdminRoute";
import orgRouter from "./routes/organizationRoutes";

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

app.get("/api/server", (_: Request, res: Response) =>
  res.status(200).json({ "message": "Server is here!" })
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/", superAdminRouter, orgRouter);
// app.use("/api/v1/", orgRouter);

app.use("*", (_req: Request, res: Response) => {
  res.status(400).json({ "message": "Invalid request URL!" });
});

app.listen(PORT, () =>
  console.log(`Server is up and running on port : ${PORT}`)
);
