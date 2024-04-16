import { Request, Response, Router } from "express";
import userController from "../controllers/users/user-controller";

const userRouter = Router();

userRouter.post("/register", (req: Request, res: Response) => {
  userController.createUser(req.body, res);
});
userRouter.post("/login", (req: Request, res: Response) => {
  userController.userLogin(req.body, res);
});
export default userRouter;
