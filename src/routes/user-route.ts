import { Router } from "express";
import userController from "../controllers/users/user-controller";

const userRouter = Router();

userRouter.post("/login", (req, res) => {
  userController.userLogin(req, res);
});
userRouter.post("/user-login", (req, res) => {
  userController.loginUser(req, res);
});
export default userRouter;
