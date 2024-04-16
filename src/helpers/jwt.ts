import jwt from "jsonwebtoken";
import { IUser } from "../types";
const jwtSecret = "28282hsnnshs";

const createToken = (payload: IUser) => {
  const token = jwt.sign({ payload }, jwtSecret, { expiresIn: "24h" });
  return token;
};

export default createToken;
