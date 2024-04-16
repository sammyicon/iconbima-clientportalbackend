import Express, { Response, Request } from "express";
import cors from "cors";
import connectToDatabase from "./config/database-config";
import quoteRouter from "./routes/quote-route";
const app = Express();
app.use(cors());
app.use(Express.json());

connectToDatabase();

app.listen(5000, () => console.log("Server has started..."));

app.post("", (req: Request, res: Response) => {
  return res.send("Welcome to client portal API");
});

app.use("request/", quoteRouter);
