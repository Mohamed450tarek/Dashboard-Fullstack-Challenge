import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import sendEmail from "../utils/sendmail.js";
import createToken from "../utils/kreatetoken.js";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// signup
export const signup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  const token = createToken(user._id);

  res.status(201).json({
    data: user,
    token,
    success: true,
  });
});

// login 
export const login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select("+password");

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  const token = createToken(user._id);
  delete user._doc.password;

  res.status(200).json({
    data: user,
    token,
    success: true,
  });
});

// protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError("Not authorized. Please login.", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError("User no longer exists.", 401));
  }

  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
    if (passChangedTimestamp > decoded.iat) {
      return next(new ApiError("Password changed recently. Please login again.", 401));
    }
  }

  req.user = currentUser;
  next();
});

//  authorize roles
export const allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You are not allowed to access this route",
      });
    }
    next();
  };
};

//  forget password

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`No user found with email ${req.body.email}`, 404));
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto.createHash("sha256").update(resetCode).digest("hex");

  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  const message = `Hi ${user.username},\nWe received a request to reset your password.\nYour reset code is: ${resetCode}\nIt will expire in 10 minutes.\n- Mohamed Tarek`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError("Error sending email", 500));
  }

  res.status(200).json({
    status: "success",
    message: "Reset code sent to email",
  });
});

// reset code verification
export const verifyPassResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Invalid or expired reset code", 400));
  }

  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({ status: "success" });
});

//  reset password
export const resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`No user found with email ${req.body.email}`, 404));
  }

  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  const token = createToken(user._id);
  res.status(200).json({ token });
});

//  login with google 
export const googleLogin = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return next(new ApiError("No Google ID Token provided", 400));
  }

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, name, picture } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      username: name,
      email,
      password: null,
      profileImg: { secure_url: picture },
    });
  }

  const token = createToken(user._id);
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });

  if (user._doc.password) delete user._doc.password;

  res.status(200).json({
    data: user,
    token,
    refreshToken,
    success: true,
  });
});
