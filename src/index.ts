import Express, { Response, Request } from "express";
import cors from "cors";
import quoteRouter from "./routes/quote-route";
import { config } from "dotenv";
import userRouter from "./routes/user-route";
import policyRouter from "./routes/policy-routes";
import claimsRouter from "./routes/claims-routes";
import premiumsRouter from "./routes/premiums-routes";

const app = Express();
app.use(cors());
app.use(Express.json());
config();

const port = process.env.PORT as number | string;

app.listen(port, () => console.log(`server started on port ${port}`));

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "API is live" });
});

app.use("/request", quoteRouter);
app.use("/policies", policyRouter);
app.use("/claims", claimsRouter);
app.use("/premiums", premiumsRouter);
app.use("/user", userRouter);
