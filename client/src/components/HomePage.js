import React, { useState, useEffect } from "react";
import PostQuestionForm from "./PostQuestionForm";
import CommentSection from "./CommentSection";
import axios from "axios";

const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [view, setView] = useState("feed");
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [editQuestionText, setEditQuestionText] = useState("");

  const userRole = localStorage.getItem("role");

  useEffect(() => {
    if (view === "feed") {
      fetchQuestions();
    }
  }, [view]);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URI}/api/questions`
      );
      setQuestions(res.data);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  const fetchPendingQuestions = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID not found in local storage.");
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URI}/api/questions/pending/${userId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPendingQuestions(res.data);
      if (res.data.length === 0) {
        console.log("No pending questions found.");
      }
    } catch (err) {
      console.error("Error fetching pending questions:", err);
    }
  };

  const handlePostQuestion = async (newQuestion) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URI}/api/questions`,
        newQuestion,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200 && res.data.success) {
        // Update pendingQuestions with the newly created question
        setPendingQuestions((prev) => {
          return [...prev, res.data]; // Add the new question to the existing array
        });
        console.log(pendingQuestions);
      }
    } catch (err) {
      console.error("Error posting new question:", err);
    }
  };

  const handleAddComment = async (postId, comment) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URI}/api/questions/${postId}/comment`,
        { comment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setQuestions((prev) =>
        prev.map((q) => (q._id === res.data._id ? res.data : q))
      );
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
    if (newView === "pending" && pendingQuestions.length === 0) {
      fetchPendingQuestions();
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URI}/api/questions/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setQuestions((prev) => prev.filter((q) => q._id !== postId));
      } else {
        console.error("Failed to delete the question.");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleUpdatePost = async (postId) => {
    if (!editQuestionText.trim()) return;

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URI}/api/questions/update/${postId}`,
        { Question: editQuestionText },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setQuestions((prev) =>
          prev.map((q) =>
            q._id === postId ? { ...q, Question: editQuestionText } : q
          )
        );
        setEditQuestionId(null);
        setEditQuestionText("");
      }
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div
        className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-lg overflow-y-auto"
        style={{ height: "calc(100vh - 100px)" }}
      >
        <h1 className="text-2xl font-bold mb-4">Home Page</h1>
        <button
          className={`px-4 py-2 ${view === "feed" ? "bg-blue-500" : ""}`}
          onClick={() => handleViewChange("feed")}
        >
          Feed
        </button>
        <button
          className={`px-4 py-2 ml-2 ${
            view === "pending" ? "bg-blue-500" : ""
          }`}
          onClick={() => handleViewChange("pending")}
        >
          Pending Questions
        </button>

        {view === "feed" && (
          <div>
            <PostQuestionForm onSubmit={handlePostQuestion} />
            {questions.map((q) => (
              <div key={q._id} className="border p-4 mt-4">
                {editQuestionId === q._id ? (
                  <div>
                    <input
                      type="text"
                      value={editQuestionText}
                      onChange={(e) => setEditQuestionText(e.target.value)}
                      className="w-full border rounded p-2"
                    />
                    <button
                      onClick={() => handleUpdatePost(q._id)}
                      className="bg-blue-500 text-white px-2 py-1 mt-2 rounded"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setEditQuestionId(null)}
                      className="text-gray-500 ml-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold">
                      {q.Question || "No question text available"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Tag: {q.tag || "No tag"}
                    </p>
                    <div className="flex justify-end">
                      {q.userId?._id === localStorage.getItem("userId") && (
                        <div>
                          <button
                            onClick={() => handleDeletePost(q._id)}
                            className="text-red-500 ml-2"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => {
                              setEditQuestionId(q._id);
                              setEditQuestionText(q.Question || "");
                            }}
                            className="text-blue-500 ml-2"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                    <CommentSection
                      postId={q._id}
                      comments={q.comments || []}
                      onAddComment={handleAddComment}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {view === "pending" && (
          <div>
            {pendingQuestions.length === 0 ? (
              <p>No Pending Questions found</p>
            ) : (
              pendingQuestions.map((q) => (
                <div key={q._id} className="border p-4 mt-4">
                  <p className="font-bold">
                    {q.Question || "No question text available"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Tag: {q.tag || "No tag"}
                  </p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDeletePost(q._id)}
                      className="text-red-500 ml-2"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setEditQuestionId(q._id);
                        setEditQuestionText(q.Question || "");
                      }}
                      className="text-blue-500 ml-2"
                    >
                      Edit
                    </button>
                  </div>
                  <CommentSection
                    postId={q._id}
                    comments={q.comments || []}
                    onAddComment={handleAddComment}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
