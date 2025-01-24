import { Router } from "express";
import premiumController from "../controllers/premiums/premiums-controller.js";

const premiumsRouter = Router();

premiumsRouter.post("/fetch", (req, res) => {
  premiumController.getPremiumsAndCommission(req, res);
});
export default premiumsRouter;
