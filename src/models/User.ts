import { model, Schema } from "mongoose";
import { IUser } from "../types";

const userSchema = new Schema<IUser>({
  email: { type: String },
  fullName: { type: String },
  phoneNumber: { type: String },
  address: { type: String },
  password: { type: String },
});

const UserModel = model("UserModel", userSchema);
export default UserModel;
