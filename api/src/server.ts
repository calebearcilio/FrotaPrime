import express, { Express, Request, Response } from "express";

const server: Express = express();
server.use(express.json());

server.get("/", (_req: Request, res: Response) => {
  return res.status(200).send("Hello World!");
})

server.listen(3000, () => {
  console.log(`Server running in: http://localhost:3000`)
})