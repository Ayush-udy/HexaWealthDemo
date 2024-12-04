const Questions = require("../models/QuestionModel");

// Add a new question
exports.addQuestion = async (req, res) => {
  try {
    const { Question, tag } = req.body;
    const newQuestion = new Questions({
      userId: req.user._id,
      Question,
      tag,
    });
    await newQuestion.save();
    res.status(201).send({
      success: true,
      message: "Question submitted for approval",
      data: newQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding question", error });
  }
};

// Fetch all approved questions
exports.getApprovedQuestions = async (req, res) => {
  try {
    const questions = await Questions.find({ isApproved: true }).populate(
      "userId",
      "name"
    );
    res.status(200).json(questions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching approved questions", error });
  }
};

// Fetch pending questions (admin only)
exports.getPendingQuestions = async (req, res) => {
  try {
    const questions = await Questions.find({ isApproved: false }).populate({
      path: "userId",
    });
    console.log("It is pending section");
    res.status(200).json(questions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pending questions", error });
  }
};

// Controller to fetch pending questions for a specific user
exports.getUserPendingQuestions = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from route parameters

    // Fetch questions that are pending and belong to the user
    const pendingQuestions = await Questions.find({
      userId: userId,
      isApproved: false, // Assuming there's a `status` field indicating the question's state
    });

    if (!pendingQuestions || pendingQuestions.length === 0) {
      return res.status(404).json({ message: "No pending questions found." });
    }

    res.status(200).json(pendingQuestions);
  } catch (error) {
    console.error("Error fetching pending questions:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch pending questions.", error });
  }
};

// Approve a question (admin only)
exports.approveQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Questions.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json({ message: "Question approved", question });
  } catch (error) {
    res.status(500).json({ message: "Error approving question", error });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params; // Extracting the questionId from the route parameters
    const { Question } = req.body; // Extracting the new question text from the request body

    // Check if the required field 'Question' is provided
    if (!Question) {
      return res
        .status(400)
        .json({ success: false, message: "Question text is required." });
    }

    // Find the question by ID
    const question = await Questions.findById(questionId);
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found." });
    }

    // Update the 'Question' field with the new value
    question.Question = Question;

    // Save the updated question to the database
    const updatedQuestion = await question.save();

    // Respond with the updated question and a success message
    res.status(200).json({
      success: true,
      message: "Question updated successfully.",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Delete a question (admin or owner)
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Questions.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    await Questions.findByIdAndDelete(id); // Use deleteOne or findByIdAndDelete instead
    res.status(200).json({ success: true, message: "Question deleted" });
  } catch (error) {
    console.error("Error deleting question:", error); // Log the error details
    res
      .status(500)
      .json({ success: false, message: "Error deleting question", error });
  }
};
