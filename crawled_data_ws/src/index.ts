//import express, { Express, Request, Response } from 'express';
import express, { Application, Request, Response } from "express";
import cors from "cors";
const expressApp: Application = express();

const PORT = +(process.env.APPLICATION_PORT || 6000);

expressApp.use(cors());
expressApp.use(express.json());

const port = +(process.env.APPLICATION_PORT || 6000);

expressApp.get("/", (req, res) => {
    res.send("⚡️[server], Tout la vie!!");
});

expressApp.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});