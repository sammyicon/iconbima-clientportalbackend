import { Router } from "express";
import glStatements from "../controllers/GLstatements/gl-statements-controller.js";

const glStatementsRouter = Router();

glStatementsRouter.post("/fetch", (req, res) => {
  glStatements.getGlStatements(req, res);
});
export default glStatementsRouter;
