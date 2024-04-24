import { Router } from "express";
import userController from "../controllers/users/user-controller";

const userRouter = Router();

userRouter.post("/login", (req, res) => {
  userController.userLogin(req, res);
});
export default userRouter;
