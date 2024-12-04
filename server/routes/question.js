const express = require("express");
const router = express.Router();
const questionController = require("../controllers/QuestionController");
const authMiddleware = require("../middlware/authMiddleware");
const adminMiddleware = require("../middlware/adminMiddleware");
const commentController = require("../controllers/CommentController");
// Add a question
router.post("/", authMiddleware, questionController.addQuestion);

//Fetch all Questions

// Fetch all approved questions
router.get("/", questionController.getApprovedQuestions);

// Fetch pending questions (admin only)
router.get(
  "/pending",
  authMiddleware,
  //   adminMiddleware,
  questionController.getPendingQuestions
);

//Fetch User Pending Questions,
router.get(
  "/pending/:userId",
  authMiddleware,
  questionController.getUserPendingQuestions
);

// Approve a question (admin only)
router.patch(
  "/approve/:id",
  authMiddleware,
  questionController.approveQuestion
);

//Update a question.
router.put(
  "/update/:questionId",
  authMiddleware,
  questionController.updateQuestion
);
// Delete a question (admin or owner)
router.delete("/:id", authMiddleware, questionController.deleteQuestion);

//Comments Routes
// Create a comment
router.post("/createComment", authMiddleware, commentController.createComment);

// Update a comment
router.put(
  "/updateComment/:commentId",
  authMiddleware,
  commentController.updateComment
);

// Delete a comment
router.delete(
  "/deleteComment/:commentId",
  authMiddleware,
  commentController.deleteComment
);

// Get all comments for a question
router.get("/comments/:questionId", commentController.getCommentsByQuestionId);

module.exports = router;
