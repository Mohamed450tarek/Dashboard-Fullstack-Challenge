import express from "express";
import {
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from "../controllers/quizController.js";
import { protect, allowedTo } from "../middleware/auth-middleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getQuizzes)
  .post(protect, allowedTo("teacher", "admin"), createQuiz);

router
  .route("/:id")
  .get(protect, getQuiz)
  .put(protect, allowedTo("teacher", "admin"), updateQuiz)
  .delete(protect, allowedTo("teacher", "admin"), deleteQuiz);

export default router;
