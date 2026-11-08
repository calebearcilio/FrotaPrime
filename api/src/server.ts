import express, { Express, Request, Response } from "express";
import "dotenv/config";
import routes from "./routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import cors from "cors";

const PORT = process.env.API_PORT || 3000;

const server: Express = express();
server.use(express.json());

server.use(cors())

server.use(routes);

server.get("/", (_req: Request, res: Response) => {
  return res.status(200).send("Hello World!");
});

server.use(globalErrorHandler);

server.listen(PORT, () => {
  console.log(`Server running in: http://localhost:${PORT}`);
});
