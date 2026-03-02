const express = require("express");
const router = express.Router();
const {
  startAssignment,
  executeAssignmentQuery,
  getHint
} = require("../controllers/sandboxController");


router.post("/execute", executeAssignmentQuery);

router.post("/start", startAssignment);
router.post("/hint", getHint);

module.exports = router;