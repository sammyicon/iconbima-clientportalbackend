import { Router } from "express";
import policyController from "../controllers/policies/policies-controller.js";

const policyRouter = Router();

policyRouter.post("/fetch", (req, res) => {
  policyController.getPolicies(req, res);
});
policyRouter.post("/running/fetch", (req, res) => {
  policyController.getRunningPolicies(req, res);
});
policyRouter.post("/fetch/products", (req, res) => {
  policyController.getProducts(req, res);
});
export default policyRouter;
