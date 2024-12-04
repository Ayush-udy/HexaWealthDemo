import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]); // To store all posts
  const [pendingQuestions, setPendingQuestions] = useState([]); // To store pending questions

  const token = localStorage.getItem("token"); // Retrieve the token from local storage
  const role = localStorage.getItem("role");

  // Fetch posts and pending questions from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts
        const postsResponse = await axios.get(
          `${process.env.REACT_APP_API_URI}/api/questions`
        ); // Replace with actual posts API
        setPosts(postsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPendingQuestions = async () => {
      try {
        const questionsResponse = await axios.get(
          `${process.env.REACT_APP_API_URI}/api/questions/pending`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPendingQuestions(questionsResponse.data); // Set pending questions data
      } catch (error) {
        console.error("Error fetching pending questions:", error);
      }
    };

    fetchPendingQuestions();
  }, []);

  // Function to delete a post
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URI}/api/questions/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); // Replace with actual delete API
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Function to approve or reject a question
  const handleQuestionAction = async (questionId, action) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token
      await axios.patch(
        `${process.env.REACT_APP_API_URI}/api/questions/approve/${questionId}`,
        { isApproved: action === "approve" }, // Pass the updated approval status
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request
          },
        }
      );
      setPendingQuestions(
        pendingQuestions.filter((question) => question._id !== questionId)
      );
    } catch (error) {
      console.error(`Error ${action} question:`, error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="mb-8">
          Welcome to the Admin Dashboard! Manage all admin actions here.
        </p>

        {/* Posts Management Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Manage Posts</h2>
          {posts.length > 0 ? (
            <ul className="space-y-4">
              {posts.map((post) => (
                <li
                  key={post._id}
                  className="p-4 bg-gray-100 rounded shadow flex justify-between items-center"
                >
                  <div>
                    <p className="text-base text-gray-700">{post.Question}</p>
                    <span className="text-sm text-gray-700">
                      Tag:{" "}
                      <span className="text-gray-50 rounded-md bg-gray-500 px-1 text-xs font-medium">
                        {post.tag}
                      </span>
                    </span>
                  </div>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    Delete Post
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No posts available.</p>
          )}
        </div>

        {/* Pending Questions Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Manage Questions Approval</h2>
          {pendingQuestions.length > 0 ? (
            <ul className="space-y-4">
              {pendingQuestions.map((question) => (
                <li
                  key={question._id}
                  className="p-4 bg-gray-100 rounded shadow flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg text-gray-700">{question.Question}</p>
                    <span className="text-sm text-gray-500">
                      Author: {question.userId?.username || "Unknown"} {"  "}
                    </span>
                    <span className="text-sm text-gray-900 ">
                      Tag:{" "}
                      <span className="text-gray-50 rounded-md bg-gray-500 px-2 text-xs font-medium">
                        {question.tag || "Unknown"}
                      </span>
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 text-base"
                      onClick={() =>
                        handleQuestionAction(question._id, "approve")
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 text-base"
                      onClick={() =>
                        handleQuestionAction(question._id, "reject")
                      }
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No pending questions.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
