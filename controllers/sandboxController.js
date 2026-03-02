const Assignment = require("../models/Assignment");
const { createSandbox, executeQuery } = require("../services/sandboxService");
const Attempt = require("../models/Attempt");
const { generateHint } = require("../services/llmService");


// 🚀 Start Assignment
exports.startAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.body;
    const userId = "demoUser";

    if (!assignmentId) {
      return res.status(400).json({ message: "assignmentId is required" });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const schemaName = await createSandbox(assignment, userId);

    res.json({
      success: true,
      message: "Sandbox created",
      schemaName
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// 🚀 Execute Query
exports.executeAssignmentQuery = async (req, res) => {
  try {
    const { schemaName, query, assignmentId } = req.body;

    if (!schemaName || !query || !assignmentId) {
      return res.status(400).json({
        success: false,
        message: "schemaName, query and assignmentId are required"
      });
    }

    const executionResult = await executeQuery(schemaName, query);

    if (!executionResult.success) {
      return res.json({
        success: false,
        error: executionResult.error
      });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found"
      });
    }

    const expected = assignment.expectedOutput.value;
    const actual = executionResult.rows;

    const isCorrect =
      JSON.stringify(expected) === JSON.stringify(actual);

    await Attempt.create({
      userId: "demoUser",
      assignmentId,
      query,
      isCorrect
    });

    res.json({
      success: true,
      rows: actual,
      isCorrect
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// 🚀 GET HINT (NOW OUTSIDE)
exports.getHint = async (req, res) => {
  try {
    const { assignmentId, userQuery } = req.body;

    if (!assignmentId || !userQuery) {
      return res.status(400).json({
        success: false,
        message: "assignmentId and userQuery required"
      });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found"
      });
    }

    const hint = await generateHint({
      problemStatement: assignment.description,
      expectedOutput: assignment.expectedOutput,
      userQuery
    });

    res.json({
      success: true,
      hint
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};