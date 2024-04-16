import Express, { Response, Request } from "express";
import cors from "cors";
import connectToDatabase from "./config/database-config";
import quoteRouter from "./routes/quote-route";
import { config } from "dotenv";

const app = Express();
app.use(cors());
app.use(Express.json());
config();

connectToDatabase();

const port = process.env.PORT as number | string;

app.listen(port, () => console.log(`server started on port ${port}`));

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "API is live" });
});

app.use("/request", quoteRouter);
