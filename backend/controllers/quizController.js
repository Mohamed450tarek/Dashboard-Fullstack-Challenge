import Quiz from "../models/Quiz.js";

//  all quizzes
export const getQuizzes = async (req, res) => {
  try {
    const { course, isPublished } = req.query;

    const query = {};
    if (course) query.course = course;
    if (isPublished !== undefined) query.isPublished = isPublished === "true";

    const quizzes = await Quiz.find(query)
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: quizzes.length,
      data: { quizzes },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// get  one quiz

export const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate(
      "createdBy",
      "username email"
    );

    if (!quiz) {
      return res.status(404).json({
        status: "error",
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: { quiz },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

//  create new quiz 
export const createQuiz = async (req, res) => {
  try {
    req.body.createdBy = req.user?._id;

    const quiz = await Quiz.create(req.body);

    res.status(201).json({
      status: "success",
      data: { quiz },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// ====================== Update Quiz ======================
export const updateQuiz = async (req, res) => {
  try {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        status: "error",
        message: "Quiz not found",
      });
    }

    if (
      quiz.createdBy.toString() !== req.user?._id.toString() &&
      req.user?.role !== "admin"
    ) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this quiz",
      });
    }

    quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: { quiz },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// ====================== Delete Quiz ======================
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        status: "error",
        message: "Quiz not found",
      });
    }

    if (
      quiz.createdBy.toString() !== req.user?._id.toString() &&
      req.user?.role !== "admin"
    ) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this quiz",
      });
    }

    await quiz.deleteOne();

    res.status(200).json({
      status: "success",
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
