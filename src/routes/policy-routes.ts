import { Request, Response, Router } from "express";
import policyController from "../controllers/policies/policies-controller";

const policyRouter = Router();

policyRouter.post("/fetch", (req, res) => {
  policyController.getPolicies(req, res);
});
export default policyRouter;
