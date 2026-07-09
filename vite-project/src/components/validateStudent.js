function validateStudent(student) {
  const errors = {};

  // Name
  if (!student.name || student.name.trim() === "") {
    errors.name = "Please Enter Name";
  }

  // Registration Number
  if (
    !student.registrationNumber ||
    student.registrationNumber.trim() === ""
  ) {
    errors.registrationNumber = "Please Enter Registration Number";
  }

  // Semester
  if (
    student.semester === "" ||
    Number(student.semester) <= 0
  ) {
    errors.semester = "Please Enter Valid Semester";
  }
   //it return js object
  return errors;
}
export default validateStudent;