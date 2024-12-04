import React, { useState } from "react";

const PostQuestionForm = ({ onSubmit }) => {
  const [Question, setQuestion] = useState("");
  const [tag, setTag] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!Question || !tag) {
      alert("Both question and tag are required.");
      return;
    }
    onSubmit({ Question, tag });
    setQuestion("");
    setTag("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={Question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter your question"
        className="w-full border rounded p-2"
        required
      />
      <input
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        placeholder="Enter a tag"
        className="w-full border rounded p-2"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Post Question
      </button>
    </form>
  );
};

export default PostQuestionForm;
