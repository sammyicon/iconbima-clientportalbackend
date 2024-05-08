import { Router } from "express";
import upcomingRenewals from "../controllers/upcomingRenewals/upcoming-renewals-controller";

const upcomingRenewalsRouter = Router();

upcomingRenewalsRouter.post("/fetch", (req, res) => {
  upcomingRenewals.getUpcomingRenewals(req, res);
});
export default upcomingRenewalsRouter;
