const express = require("express");
const router = express.Router();
const {
  getAllAssignments,
  getAssignmentById
} = require("../controllers/assignmentController");

router.get("/", getAllAssignments);
router.get("/:id", getAssignmentById);

module.exports = router;