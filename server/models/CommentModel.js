const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    // The user who posted the comment
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Reference to User model
      required: true,
    },
    // The question that the comment is related to
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Questions", // Reference to Question model
      required: true,
    },
    // The actual content of the comment
    content: {
      type: String,
      required: true,
      trim: true,
    },
    // Timestamp when the comment was created
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // Timestamp when the comment was last updated (if applicable)
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    // Optional: A list of users who liked the comment
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to User model
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Comment model
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
