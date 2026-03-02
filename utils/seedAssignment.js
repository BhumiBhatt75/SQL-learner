const mongoose = require("mongoose");
require("dotenv").config();
const connectMongo = require("../config/mongo");
const Assignment = require("../models/Assignment");

const seed = async () => {
  await connectMongo();

  await Assignment.deleteMany(); // reset for testing

  const assignment = new Assignment({
    title: "Basic SELECT Query",
    description: "Easy",
    question: "Retrieve all users from the users table.",
    sampleTables: [
      {
        tableName: "users",
        columns: [
          { columnName: "id", dataType: "INTEGER" },
          { columnName: "name", dataType: "TEXT" },
          { columnName: "age", dataType: "INTEGER" }
        ],
        rows: [
          { id: 1, name: "John", age: 25 },
          { id: 2, name: "Jane", age: 30 }
        ]
      }
    ],
    expectedOutput: {
      type: "table",
      value: [
        { id: 1, name: "John", age: 25 },
        { id: 2, name: "Jane", age: 30 }
      ]
    }
  });

  await assignment.save();
  console.log("Assignment seeded");
  process.exit();
};

seed();