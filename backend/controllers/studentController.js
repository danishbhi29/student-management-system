const Student = require("../models/student");
const fs = require("fs");
const path = require("path");

const getStudents = async (req, res) => {
  console.log(req.user);
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Unable to get students",
    });
  }
};

const createStudents = async (req, res) => {
  try {
    const { name, registrationNumber, semester } = req.body;

    const student = new Student({
      name,
      registrationNumber,
      semester,
      image: req.file ? req.file.filename : "",
    });

    await student.save();

    res.status(201).json({
      message: "Student Added Successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error in adding student",
    });
  }
};

const deleteStudents = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    res.json({
      message: "Student deleted successfully",
      name: deletedStudent.name,
    });
  } catch (error) {
    console.log("unable to delete");
    res.send(error);
  }
};

const updateStudents = async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  try {
    const { name, registrationNumber, semester } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    if (req.file && student.image) {
      const imagePath = path.join(__dirname, "../uploads", student.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    const updateStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name,
        registrationNumber,
        semester,
        image: req.file ? req.file.filename : student.image,
      },
      { new: true },
    );

    res.json({
      message: "Student updated successfully",
      name: updateStudent.name,
    });
  } catch (error) {
    console.log("unable to update");
    res.send(error);
  }
};

module.exports = {
  getStudents,
  createStudents,
  deleteStudents,
  updateStudents,
};
