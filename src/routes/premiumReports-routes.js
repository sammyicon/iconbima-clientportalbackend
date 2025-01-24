import { Router } from "express";
import premiumReportsController from "../controllers/premiumReports/premiumReports-controller.js";

const premiumReportsRouter = Router();

premiumReportsRouter.post("/fetch", (req, res) => {
  premiumReportsController.getPremiumReports(req, res);
});
export default premiumReportsRouter;
