import { Router } from "express";
import glStatements from "../controllers/GLstatements/gl-statements-controller.js";
import glStatementOutstanding from "../controllers/GLstatements/gl-statements-outstanding.js";

const glStatementsRouter = Router();

glStatementsRouter.post("/fetch", (req, res) => {
  glStatements.getGlStatements(req, res);
});
glStatementsRouter.post("/outs/fetch", (req, res) => {
  glStatementOutstanding.getGlStatementsOutstanding(req, res);
});
export default glStatementsRouter;
