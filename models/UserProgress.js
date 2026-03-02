const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema({
  userId: String,
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment"
  },
  sqlQuery: String,
  lastAttempt: Date,
  isCompleted: Boolean,
  attemptCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("UserProgress", userProgressSchema);