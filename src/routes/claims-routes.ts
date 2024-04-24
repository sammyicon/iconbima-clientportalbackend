import { Router } from "express";
import claimsController from "../controllers/claims/claims-controller";

const claimsRouter = Router();

claimsRouter.post("/fetch", (req, res) => {
  claimsController.getClaims(req, res);
});
export default claimsRouter;
