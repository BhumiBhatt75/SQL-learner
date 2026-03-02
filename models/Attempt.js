const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  userId: String,
  assignmentId: mongoose.Schema.Types.ObjectId,
  query: String,
  isCorrect: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Attempt", attemptSchema);