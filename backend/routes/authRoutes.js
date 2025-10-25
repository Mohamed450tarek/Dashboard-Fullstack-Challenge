import express from "express";
import {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
  googleLogin,
} from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyResetCode", verifyPassResetCode);
router.post("/resetPassword", resetPassword);
router.post("/googleLogin", googleLogin);

export default router;
