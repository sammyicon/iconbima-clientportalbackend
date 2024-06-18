import { Router } from "express";
import userController from "../controllers/users/user-controller";

const userRouter = Router();

/**
 * @openapi
 * '/user/user-login/':
 *  post:
 *     tags:
 *     - User Login Controller
 *     summary: Login as broker or agent
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - un
 *               - pw
 *             properties:
 *               un:
 *                 type: string
 *                 default: icon
 *               pw:
 *                 type: string
 *                 default: Bima123
 *     responses:
 *       200:
 *         description: Logged in
 *       409:
 *         description: Conflict
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 */

userRouter.post("/login", (req, res) => {
  userController.userLogin(req, res);
});
userRouter.post("/user-login", (req, res) => {
  userController.loginUser(req, res);
});
export default userRouter;
