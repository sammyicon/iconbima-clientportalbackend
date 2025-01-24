import { Router } from "express";
import claimsController from "../controllers/claims/claims-controller.js";

const claimsRouter = Router();

claimsRouter.post("/fetch", (req, res) => {
  claimsController.getClaims(req, res);
});
export default claimsRouter;
