import { Router } from "express";
import claimCreditNotesController from "../controllers/claimCreditNotes/claim-credit-notes-controller";

const claimCreditNotesRouter = Router();

/**
 * @openapi
 * '/claimDebits/fetch':
 *  post:
 *     tags:
 *     - Claims Credit Notes Controller
 *     summary: Fetch broker's claims debit notes by period
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

claimCreditNotesRouter.post("/fetch", (req, res) => {
  claimCreditNotesController.getClaimCreditNotes(req, res);
});
export default claimCreditNotesRouter;
