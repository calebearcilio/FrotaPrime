import express, { Express, Request, Response } from "express";
import "dotenv/config";
import routes from "./routes";
import { globalErrorHandler } from "./middlewares/globalErrorHaddler";

const PORT = process.env.PORT || 3333;

const server: Express = express();
server.use(express.json());

server.use("/api/v1", routes);

server.get("/", (_req: Request, res: Response) => {
  return res.status(200).send("Hello World!");
});

// Central de erros
server.use(globalErrorHandler);

server.listen(PORT, () => {
  console.log(`Server running in: http://localhost:${PORT}`);
});
