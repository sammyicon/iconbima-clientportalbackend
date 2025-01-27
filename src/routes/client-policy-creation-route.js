import { Router } from "express";
import { ClientPolicyCreation } from "../controllers/client-policy-creation/client-policy-creation.js";

const clientPolicyRouter = Router();

clientPolicyRouter.post("/createClient", (req, res) => {
  ClientPolicyCreation.createClient(req, res);
});

clientPolicyRouter.post("/createPolicy", (req, res) => {
  ClientPolicyCreation.createPolicy(req, res);
});

clientPolicyRouter.get("/getOrgBranches", (req, res) => {
  ClientPolicyCreation.getOrgBranches(req, res);
});

clientPolicyRouter.get("/getSystemCodes", (req, res) => {
  ClientPolicyCreation.getSystemCodes(req, res);
});

clientPolicyRouter.get("/getCoverProducts", (req, res) => {
  ClientPolicyCreation.getCoverProducts(req, res);
});
export default clientPolicyRouter;
