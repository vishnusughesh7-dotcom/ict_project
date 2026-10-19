const express = require("express");
const mongoose = require("mongoose");
const Employee = require("../models/Employee");

const router = express.Router();
const allowedFields = ["name", "email", "department", "position", "status", "location"];

function pickEmployeeFields(body) {
  const result = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) result[field] = body[field];
  }
  return result;
}
function validId(id) {
  return mongoose.isValidObjectId(id);
}
function handleDbError(error, res) {
  if (error.code === 11000) return res.status(409).json({ message: "An employee with this email already exists." });
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ message: "Please check the employee details and try again." });
  }
  console.error(error);
  return res.status(500).json({ message: "Could not complete the request." });
}

router.get("/", async (req, res) => {
  try {
    const { search = "", department = "" } = req.query;
    const filter = {};
    if (department && department !== "All departments") filter.department = department;
    if (search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(escaped, "i");
      filter.$or = [{ name: pattern }, { email: pattern }, { position: pattern }, { department: pattern }];
    }
    const employees = await Employee.find(filter).sort({ createdAt: -1 }).limit(500);
    res.json({ data: employees, count: employees.length });
  } catch (error) { handleDbError(error, res); }
});

router.get("/:id", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid employee ID." });
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found." });
    res.json({ data: employee });
  } catch (error) { handleDbError(error, res); }
});

router.post("/", async (req, res) => {
  try {
    const employee = await Employee.create(pickEmployeeFields(req.body || {}));
    res.status(201).json({ message: "Employee created successfully.", data: employee });
  } catch (error) { handleDbError(error, res); }
});

router.put("/:id", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid employee ID." });
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id, pickEmployeeFields(req.body || {}),
      { new: true, runValidators: true }
    );
    if (!employee) return res.status(404).json({ message: "Employee not found." });
    res.json({ message: "Employee updated successfully.", data: employee });
  } catch (error) { handleDbError(error, res); }
});

router.delete("/:id", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid employee ID." });
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found." });
    res.json({ message: "Employee deleted successfully.", data: { id: employee._id } });
  } catch (error) { handleDbError(error, res); }
});

module.exports = router;
