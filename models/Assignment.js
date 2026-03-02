const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema({
  columnName: String,
  dataType: String
}, { _id: false });

const tableSchema = new mongoose.Schema({
  tableName: String,
  columns: [columnSchema],
  rows: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  }
}, { _id: false });

const expectedOutputSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["table", "single_value", "column", "count"],
  },
  value: mongoose.Schema.Types.Mixed
}, { _id: false });

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String, // difficulty
  question: String,
  sampleTables: [tableSchema],
  expectedOutput: expectedOutputSchema
}, { timestamps: true });

module.exports = mongoose.model("Assignment", assignmentSchema);