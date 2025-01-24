import { Router } from "express";
import expectedRenewals from "../controllers/expectedRenewals/expectedRenewals.js";

const expectedRenewalsRouter = Router();

expectedRenewalsRouter.post("/fetch", (req, res) => {
  expectedRenewals.getExpectedRenewals(req, res);
});
export default expectedRenewalsRouter;
