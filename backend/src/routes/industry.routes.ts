import { Router } from "express";
import {
  getIndustryController,
  getIndustryPlaylistsController,
  getIndustryScheduleController,
  getRelatedIndustriesController,
  listIndustriesController,
  listIndustryGroupsController,
} from "../controllers/industry.controller.js";

export const industryRouter = Router();

industryRouter.get("/", listIndustriesController);
industryRouter.get("/groups", listIndustryGroupsController);
industryRouter.get("/:slug", getIndustryController);
industryRouter.get("/:slug/playlists", getIndustryPlaylistsController);
industryRouter.get("/:slug/schedule", getIndustryScheduleController);
industryRouter.get("/:slug/related", getRelatedIndustriesController);
