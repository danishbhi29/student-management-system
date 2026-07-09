const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  registrationNumber: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 20,
  },
  semester: {
    type: Number,
    required: true,
  },

});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
