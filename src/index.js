import Express from "express";
import cors from "cors";

import { config } from "dotenv";
import policyRouter from "./routes/policy-routes.js";
import claimsRouter from "./routes/claims-routes.js";
import premiumsRouter from "./routes/premiums-routes.js";
import arReceiptsRouter from "./routes/ARreceipts-routes.js";
import premiumReportsRouter from "./routes/premiumReports-routes.js";
import claimCreditNotesRouter from "./routes/claimCreditNotes-route.js";
import claimDebitsRouter from "./routes/claimDebits-route.js";
import receiptsRouter from "./routes/receipts-routes.js";
import commissionPaybleRouter from "./routes/commisionpayble-routes.js";
import glStatementsRouter from "./routes/gl-statements-routes.js";
import upcomingRenewalsRouter from "./routes/upcoming-renewals-routes.js";
import expectedRenewalsRouter from "./routes/expectedRenewalsRouter.js";
import travelCertRouter from "./routes/travel-cert.route.js";
import userRouter from "./routes/user-routes.js";
import clientPolicyRouter from "./routes/client-policy-creation-route.js";
import marineRouter from "./routes/marinePolicy.route.js";

const app = Express();
app.use(cors());
app.use(Express.json());
config();

const port = process.env.PORT;

app.listen(port, () => console.log(`server started on port ${port}`));

app.get("/", (req, res) => {
  return res.status(200).json({ success: true, message: "API is live" });
});

app.use("/user", userRouter);
app.use("/policies", policyRouter);
app.use("/claims", claimsRouter);
app.use("/premiums", premiumsRouter);
app.use("/ARreceipts", arReceiptsRouter);
app.use("/premiumReports", premiumReportsRouter);
app.use("/claimCreditNotes", claimCreditNotesRouter);
app.use("/claimDebits", claimDebitsRouter);
app.use("/receipts", receiptsRouter);
app.use("/commissionPayble", commissionPaybleRouter);
app.use("/glStatements", glStatementsRouter);
app.use("/upcomingRenewals", upcomingRenewalsRouter);
app.use("/expectedRenewals", expectedRenewalsRouter);
app.use("/travel", travelCertRouter);
app.use("/policy", clientPolicyRouter);
app.use("/marine", marineRouter);
