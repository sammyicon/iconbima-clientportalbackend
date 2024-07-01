import Express, { Response, Request } from "express";
import cors from "cors";
import quoteRouter from "./routes/quote-route";
import { config } from "dotenv";
import userRouter from "./routes/user-route";
import policyRouter from "./routes/policy-routes";
import claimsRouter from "./routes/claims-routes";
import premiumsRouter from "./routes/premiums-routes";
import arReceiptsRouter from "./routes/ARreceipts-routes";
import premiumReportsRouter from "./routes/premiumReports-routes";
import claimCreditNotesRouter from "./routes/claimCreditNotes-route";
import receiptsRouter from "./routes/receipts-routes";
import claimDebitsRouter from "./routes/claimDebits-route";
import commissionPaybleRouter from "./routes/commisionpayble-routes";
import glStatementsRouter from "./routes/gl-statements-routes";
import upcomingRenewalsRouter from "./routes/upcoming-renewals-routes";
import { setupSwagger } from "./swagger";
import travelCertRouter from "./routes/travel-cert.route";

const app = Express();
app.use(cors());
app.use(Express.json());
config();

const port = process.env.PORT as number | string;

setupSwagger(app);

app.listen(port, () => console.log(`server started on port ${port}`));

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "API is live" });
});

app.use("/request", quoteRouter);
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
app.use("/travel", travelCertRouter);
app.use("/user", userRouter);
