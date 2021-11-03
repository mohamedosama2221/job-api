const mongoose = require("mongoose");

const Job = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide a company name"],
      maxlength: [20, "Company name cannot exceed 20 characters"],
    },
    position: {
      type: String,
      required: [true, "Please provide a valid position"],
      maxlength: [35, "Position name cannot exceed 20 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "interview", "declined"],
        message: "{{VALUE}} is not supported",
      },
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", Job);
