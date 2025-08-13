import { Router } from "express";
import userController from "../controllers/users/users-controller.js";

const userRouter = Router();

userRouter.post("/user-login", (req, res) => {
  userController.loginUser(req, res);
});
userRouter.post("/user-roles", (req, res) => {
  userController.userRoles(req, res);
});
userRouter.post("/clients", (req, res) => {
  userController.getUsers(req, res);
});
userRouter.post("/balance", (req, res) => {
  userController.getEntityBalance(req, res);
});
export default userRouter;
