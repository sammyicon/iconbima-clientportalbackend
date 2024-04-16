import { Request, Response, Router } from "express";
import quoteController from "../controllers/quotes/request-quote";

const quoteRouter = Router();

quoteRouter.post("/motor", (req: Request, res: Response) => {
  quoteController.requestMotorQuote(req.body, res);
});
quoteRouter.post("/non-motor", (req: Request, res: Response) => {
  quoteController.requestNonMotorQuote(req.body, res);
});
quoteRouter.post("/select-motor", (req: Request, res: Response) => {
  quoteController.selectMotorQuote(req.body, res);
});
quoteRouter.get("/fetch", (req: Request, res: Response) => {
  quoteController.fetchUserQuotes(req.body, res);
});

export default quoteRouter;
