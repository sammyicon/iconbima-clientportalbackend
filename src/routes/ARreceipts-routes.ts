import { Router } from "express";
import arReceiptsController from "../controllers/ARreceipts/AR-receipts-controller";

const arReceiptsRouter = Router();

/**
 * @openapi
 * '/ARreceipts/fetch':
 *  post:
 *     tags:
 *     - AR Receipts Controller
 *     summary: Fetch AR receipts
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

arReceiptsRouter.post("/fetch", (req, res) => {
  arReceiptsController.getARreceipts(req, res);
});
export default arReceiptsRouter;
