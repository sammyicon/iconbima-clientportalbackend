import { model, Schema } from "mongoose";
import { IQuote } from "../types";

const motorQuoteSchema = new Schema<IQuote>({
  user: { type: Schema.Types.ObjectId, ref: "UserModel" },
  model: { type: String },
  use: { type: String },
  PHCfund: { type: Number },
  premium: { type: Number },
  reqNumber: { type: Number },
  stamp_duty: { type: Number },
  trainning_levy: { type: Number },
  yearOfManufacture: { type: Number },
});

const MotorQuoteModel = model("MotorQuoteModel", motorQuoteSchema);
export default MotorQuoteModel;
