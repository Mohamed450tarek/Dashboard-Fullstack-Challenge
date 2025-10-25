import express from "express";
import {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";
import { protect, allowedTo } from "../middleware/auth-middleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getAnnouncements)
  .post(protect, allowedTo("teacher", "admin"), createAnnouncement);

router
  .route("/:id")
  .get(protect, getAnnouncement)
  .put(protect, allowedTo("teacher", "admin"), updateAnnouncement)
  .delete(protect, allowedTo("teacher", "admin"), deleteAnnouncement);

export default router;
