import { Router } from "express";
import { ClientPolicyCreation } from "../controllers/client-policy-creation/client-policy-creation.js";

const clientPolicyRouter = Router();

clientPolicyRouter.post("/createUser", (req, res) => {
  ClientPolicyCreation.createClient(req, res);
});

export default clientPolicyRouter;
