const Comment = require("../models/CommentModel");
const User = require("../models/UserModel"); // To get user details if necessary

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { questionId, content } = req.body;
    const userId = req.user._id; // Assuming user ID is available in req.user after authentication

    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Content is required" });
    }

    const newComment = new Comment({
      userId,
      questionId,
      content,
    });

    await newComment.save();

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ success: false, message: "Failed to add comment" });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    // Find the comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    // Check if the user is the one who posted the comment
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own comments",
      });
    }

    // Update the comment content
    comment.content = content;
    comment.updatedAt = Date.now(); // Update the timestamp

    await comment.save();

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update comment" });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { commentId } = req.params; // Retrieve the comment ID from the URL
  try {
    // Using findByIdAndDelete instead of remove
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting comment" });
  }
};

// Get all comments for a particular question
const getCommentsByQuestionId = async (req, res) => {
  try {
    const { questionId } = req.params;

    const comments = await Comment.find({ questionId })
      .populate("userId", "name email") // Populate user details (optional)
      .sort({ createdAt: -1 }); // Optional: Sorting comments by latest first

    if (comments.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No comments found" });
    }

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch comments" });
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getCommentsByQuestionId,
};
