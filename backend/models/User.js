const mongoose = require("mongoose");

// ==========================
// User Schema
// ==========================

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    default: "user",
  },
  resetToken: {
    type: String,
    default: null,
  },

  resetTokenExpiry: {
    type: Date,
    default: null,
  },
});

// ==========================
// User Model
// ==========================

const User = mongoose.model("User", userSchema);

module.exports = User;
