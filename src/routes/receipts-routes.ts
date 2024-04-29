import { Router } from "express";
import receiptsController from "../controllers/receipts/receipts-controller";

const receiptsRouter = Router();

receiptsRouter.post("/fetch", (req, res) => {
  receiptsController.getReceipts(req, res);
});
export default receiptsRouter;
