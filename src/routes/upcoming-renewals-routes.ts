import { Router } from "express";
import upcomingRenewals from "../controllers/upcomingRenewals/upcoming-renewals-controller";

const upcomingRenewalsRouter = Router();

/**
 * @openapi
 * '/upcomingRenewals/fetch':
 *  post:
 *     tags:
 *     - Upcoming Renewals Controller
 *     summary: Fetch broker's upcoming renewals  by period
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

upcomingRenewalsRouter.post("/fetch", (req, res) => {
  upcomingRenewals.getUpcomingRenewals(req, res);
});
export default upcomingRenewalsRouter;
