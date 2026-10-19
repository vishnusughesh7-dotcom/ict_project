const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: {
    type: String, required: true, trim: true, lowercase: true, unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  department: { type: String, required: true, trim: true, maxlength: 60 },
  position: { type: String, required: true, trim: true, maxlength: 80 },
  status: { type: String, enum: ["Active", "On Leave"], default: "Active" },
  location: { type: String, trim: true, maxlength: 80, default: "Not specified" }
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);
