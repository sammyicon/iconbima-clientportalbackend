import { Router } from "express";
import policyController from "../controllers/policies/policies-controller";

const policyRouter = Router();

/**
 * @openapi
 * '/policies/fetch':
 *  post:
 *     tags:
 *     - Underwritting Controller
 *     summary: Fetch policies by period
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - intermediaryCode
 *               - clientCode
 *               - fromDate
 *               - toDate
 *             properties:
 *               intermediaryCode:
 *                 type: string
 *                 default: 70
 *               clientCode:
 *                 type: string
 *                 default: 11161
 *               fromDate:
 *                 type: string
 *                 default: 1-jan-2023
 *               toDate:
 *                 type: string
 *                 default: 31-dec-2023
 *     responses:
 *       200:
 *         description: Fetched
 *       409:
 *         description: Conflict
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 */

policyRouter.post("/fetch", (req, res) => {
  policyController.getPolicies(req, res);
});
policyRouter.post("/fetch/products", (req, res) => {
  policyController.getProducts(req, res);
});
export default policyRouter;
