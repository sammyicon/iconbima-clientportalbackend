import { Router } from "express";
import claimDebitsController from "../controllers/claimDebits/claim-debits-controller";

const claimDebitsRouter = Router();

/**
 * @openapi
 * '/claimCreditNotes/fetch':
 *  post:
 *     tags:
 *     - Claims Debit Notes Controller
 *     summary: Fetch broker's claims credit notes by period
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

claimDebitsRouter.post("/fetch", (req, res) => {
  claimDebitsController.getClaimDebits(req, res);
});
export default claimDebitsRouter;
