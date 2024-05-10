import { Request, Response, Router } from "express";
import quoteController from "../controllers/quotes/request-quote";

const quoteRouter = Router();

quoteRouter.post("/motor", (req: Request, res: Response) => {
  quoteController.requestMotorQuote(req.body, res);
});

quoteRouter.post("/motor/policy", (req, res: Response) => {
  quoteController.createPolicy(req, res);
});

export default quoteRouter;
