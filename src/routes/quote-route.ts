import { Request, Response, Router } from "express";
import quoteController from "../controllers/quotes/request-qoute";

const quoteRouter = Router();

quoteRouter.post("/motor", (req: Request, res: Response) => {
  quoteController.requestMotorQuote(req.body, res);
});

export default quoteRouter;
