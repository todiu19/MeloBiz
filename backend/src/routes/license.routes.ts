import { Router } from "express";
import { lookupLicenseController } from "../controllers/license.controller.js";

export const licenseRouter = Router();

licenseRouter.post("/lookup", lookupLicenseController);
