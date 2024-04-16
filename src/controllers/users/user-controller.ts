import { Response } from "express";
import { IUser } from "../../types";
import UserModel from "../../models/User";
import passHash from "../../helpers/passHash";
import createToken from "../../helpers/jwt";

type ILogin = Pick<IUser, "email" | "password">;

class UserController {
  async createUser(req: IUser, res: Response) {
    try {
      const { address, email, fullName, password, phoneNumber } = req;
      const existingUser = await UserModel.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({ error: `${email} already exists!` });
      }
      const hashPassword = await passHash.encrypt(password);
      const newUser = new UserModel({
        address,
        email,
        fullName,
        password: hashPassword,
        phoneNumber,
      });
      await newUser.save();
      return res
        .status(200)
        .json({ success: true, message: "User created successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  }
  async userLogin(req: ILogin, res: Response) {
    try {
      const { email, password } = req;
      const findUser = await UserModel.findOne({ email: email });
      if (!findUser) {
        return res.status(400).json({ error: `${email} does not exist!` });
      }
      const isValidPass = await passHash.compare(password, findUser.password);
      if (!isValidPass) {
        return res.status(401).json({ error: "Invalid password! " });
      }
      const token = createToken(findUser);
      return res.status(200).json({ success: true, access_token: token });
    } catch (error) {
      console.error(error);
      return res.status(200).json(error);
    }
  }
}

const userController = new UserController();
export default userController;
