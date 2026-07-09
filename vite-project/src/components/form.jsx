import { useState } from "react";
import "./form.css";
import validateStudent from "./validateStudent";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Form() {
  //all states
  const [name, setName] = useState("");
  const [registrationNumber, setregistrationNumber] = useState("");
  const [semester, setSemester] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [fileEM, setfileEM] = useState("");
  const [nameEM, setNameEM] = useState("");
  const [registrationNumberEM, setregistrationNumberEM] = useState("");
  const [semesterEM, setSemesterEM] = useState("");
  const { setToken } = useContext(AuthContext);

  //create student
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Clear old success message
    setMessage("");
    const student = {
      name,
      registrationNumber,
      semester,
    };

    //validation of student form
    const errors = validateStudent(student);
    setNameEM(errors.name || "");
    setregistrationNumberEM(errors.registrationNumber || "");
    setSemesterEM(errors.semester || "");
    if (Object.keys(errors).length > 0) {
      return;
    }


    const formData = new FormData();
    formData.append("name", name);
    formData.append("registrationNumber", registrationNumber);
    formData.append("semester", semester);
    formData.append("image", file);
    for (let pair of formData.entries()) {
      console.log("dani bhi ",pair);
    }

    try {
      const response = await fetch("http://localhost:3000/student", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
       body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to add student");
      }

      const data = await response.json();
      toast.success("Student added successfully!");
      setMessage(data.message);

      // Clear form
      setName("");
      setregistrationNumber("");
      setSemester("");

      // Clear error messages
      setNameEM("");
      setregistrationNumberEM("");
      setSemesterEM("");
    } catch (error) {
      console.log(error);
      toast.error("unable to create student");
    }
  };

  return (
    <div className="container">
     
      <form className="form" onSubmit={handleSubmit}>

      <h1 className="formTitle">Student Enrollment Form</h1>

        <label>Upload Image</label>
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setfileEM("");
            setMessage("");
          }}
        />

        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameEM("");
            setMessage("");
          }}
        />
        {nameEM && <p className="error">{nameEM}</p>}

        <label htmlFor="registrationNumber">Registration Number</label>
        <input
          id="registrationNumber"
          type="text"
          placeholder="Enter Registration Number"
          value={registrationNumber}
          onChange={(e) => {
            setregistrationNumber(e.target.value);
            setregistrationNumberEM("");
            setMessage("");
          }}
        />
        {registrationNumberEM && (
          <p className="error">{registrationNumberEM}</p>
        )}

        <label htmlFor="semester">Semester</label>
        <input
          id="semester"
          type="number"
          placeholder="Enter Semester"
          value={semester}
          onChange={(e) => {
            setSemester(e.target.value);
            setSemesterEM("");
            setMessage("");
          }}
        />
        {semesterEM && <p className="error">{semesterEM}</p>}

        <button type="submit">ADD Student</button>

        {message && <p className="success">{message}</p>}
      </form>
    </div>
  );
}

export default Form;
