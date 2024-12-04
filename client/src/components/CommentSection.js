import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Import icons for edit and delete

const CommentSection = ({ postId, onAddComment, comments = [] }) => {
  const [comment, setComment] = useState("");
  const [loadedComments, setLoadedComments] = useState(comments);
  const [editCommentId, setEditCommentId] = useState(null); // Store comment id for editing
  const [editCommentText, setEditCommentText] = useState(""); // Store comment text during editing
  const [error, setError] = useState(null);

  // Fetch comments when component mounts or postId changes
  useEffect(() => {
    if (postId) {
      fetchComments(postId);
    }
  }, [postId]);

  const fetchComments = async (postId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/api/questions/comments/${postId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token for authorization
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setLoadedComments(data.comments); // Store fetched comments
      } else {
        setError(data.message || "Failed to load comments.");
      }
    } catch (err) {
      setError("An error occurred while fetching comments.");
    }
  };

  // Add a new comment
  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/api/questions/createComment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ questionId: postId, content: comment }),
        }
      );

      const data = await response.json();

      if (data.success) {
        onAddComment(data.comment); // Call parent callback to add the new comment to the list
        setComment(""); // Clear the input field
        setLoadedComments((prevComments) => [data.comment, ...prevComments]); // Optimistically update UI with new comment
      } else {
        setError(data.message || "Failed to add comment.");
      }
    } catch (err) {
      setError("An error occurred while adding comment.");
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/api/questions/deleteComment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Remove the deleted comment from the state immediately
        setLoadedComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId)
        );
      } else {
        setError(data.message || "Failed to delete comment.");
      }
    } catch (err) {
      setError("An error occurred while deleting comment.");
    }
  };

  // Update a comment
  const handleUpdateComment = async (commentId) => {
    if (!editCommentText.trim()) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/api/questions/updateComment/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ content: editCommentText }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update the comment locally in the state
        setLoadedComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId
              ? { ...comment, content: editCommentText }
              : comment
          )
        );
        setEditCommentId(null); // Reset editing state
        setEditCommentText(""); // Clear edit field
      } else {
        setError(data.message || "Failed to update comment.");
      }
    } catch (err) {
      setError("An error occurred while updating comment.");
    }
  };

  return (
    <div className="border-t mt-4">
      {error && <p className="text-red-500">{error}</p>}

      {loadedComments.map((c) => (
        <div key={c._id} className="p-2 border-b">
          {editCommentId === c._id ? (
            <div>
              <input
                type="text"
                value={editCommentText}
                onChange={(e) => setEditCommentText(e.target.value)}
                className="w-full border rounded p-2"
              />
              <button
                onClick={() => handleUpdateComment(c._id)}
                className="bg-blue-500 text-white px-2 py-1 mt-2 rounded"
              >
                Update
              </button>
              <button
                onClick={() => setEditCommentId(null)}
                className="text-gray-500 ml-2"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <p>{c.content}</p>
              {/* Assuming current user's id is available in localStorage */}
              {c.userId._id === localStorage.getItem("userId") && (
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDeleteComment(c._id)}
                    className="text-red-500 ml-2"
                  >
                    <FaTrashAlt />
                  </button>
                  <button
                    onClick={() => {
                      setEditCommentId(c._id);
                      setEditCommentText(c.content);
                    }}
                    className="text-blue-500 ml-2"
                  >
                    <FaEdit />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment"
        className="w-full border rounded p-2 mt-2"
      />
      <button
        onClick={handleAddComment}
        className="bg-green-500 text-white px-2 py-1 mt-2 rounded"
      >
        Comment
      </button>
    </div>
  );
};

export default CommentSection;
