import { Router } from "express";
import {
  getPricingController,
  submitContactController,
} from "../controllers/public.controller.js";

export const publicRouter = Router();

publicRouter.get("/pricing", getPricingController);
publicRouter.post("/contact", submitContactController);
