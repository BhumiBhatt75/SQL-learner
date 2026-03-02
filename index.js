require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectMongo = require("./config/mongo");
connectMongo();
const app = express();



app.use(cors());
app.use(express.json());
const assignmentRoutes = require("./routes/assignmentRoutes");
app.use("/api/assignments", assignmentRoutes);

const sandboxRoutes = require("./routes/sandboxRoutes");
app.use("/api/sandbox", sandboxRoutes);

app.get("/", (req, res) => {
  res.send("CipherSQLStudio API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const pool = require("./config/postgres");
