// User Routes //
import { Router } from "express";
import { signInUser, signOutUser, signUpUser } from "../controllers/user.controller.js";

// Create a new router
const userRouter = Router();

// POST /api/user/signup
userRouter.post("/signup", signUpUser);

// POST /api/user/signin
userRouter.post("/signin", signInUser);

// POST /api/user/signout
userRouter.post("/signout", signOutUser);

// Export the router
export default userRouter;
