import { Router } from "express";
import {
  completeEmailOnboarding,
  completeGoogleOnboarding,
  getCurrentUser,
  getEmailOnboarding,
  getGoogleOnboarding,
  handleGoogleCallback,
  logout,
  requestEmailOtp,
  startGoogleAuth,
  verifyEmailOtpCode,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const authRouter = Router();

authRouter.get("/google", startGoogleAuth);
authRouter.get("/google/callback", handleGoogleCallback);
authRouter.get("/google/onboarding", getGoogleOnboarding);
authRouter.post("/google/complete", completeGoogleOnboarding);
authRouter.post("/email/request-otp", requestEmailOtp);
authRouter.post("/email/verify-otp", verifyEmailOtpCode);
authRouter.get("/email/onboarding", getEmailOnboarding);
authRouter.post("/email/complete", completeEmailOnboarding);
authRouter.get("/me", requireAuth, getCurrentUser);
authRouter.post("/logout", logout);
