const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public")); // serve frontend

// Connect MongoDB (local)
mongoose.connect("mongodb://localhost:27017/crudDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Schema & Model
const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  course: String,
});
const Student = mongoose.model("Student", studentSchema);

// ----------------- CRUD API -----------------

// CREATE
app.post("/students", async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.send(student);
});

// READ
app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.send(students);
});

// UPDATE
app.put("/students/:id", async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(student);
});

// DELETE
app.delete("/students/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.send({ message: "Deleted" });
});

// Run Server

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
