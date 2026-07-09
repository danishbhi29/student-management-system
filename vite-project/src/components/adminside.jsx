// imports
import "./adminside.css";
import { useState, useEffect } from "react";
import validateStudent from "./validateStudent";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// main function
function Admin() {
  //usestates
  const [selectedImage, setSelectedImage] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [editStudent, setEditStudent] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  // const [file, setFile] = useState(null);
  // Validation Errors
  const [nameEM, setNameEM] = useState("");
  const [registrationNumberEM, setRegistrationNumberEM] = useState("");
  const [semesterEM, setSemesterEM] = useState("");
  const [fileEM, setFileEM] = useState("");
  const [loading, setLoading] = useState(true);
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  // ===========================
  // GET STUDENTS
  // ===========================
  const getStudentsFromBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/student", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      //Get
      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        toast.error("Session Expired. Please Login Again.");
        console.log("tokken expire");
        navigate("/login");
        return;
      }
      //temporary delay just to see how spinner loading look
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStudentData(data);
      console.log("Fetching Students...");
    } catch (error) {
      console.log(error);
      toast.error("Unable to delete student!");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // DELETE STUDENT
  // ===========================
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/student/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        method: "DELETE",
      });

      const data = await response.json();
      console.log(data);

      //this throw error if not deleted in backned successfully and return from fucntion call catch imediately
      if (!response.ok) {
        return toast.error(data.message);
      }

      //this line update ui with new data without callling get api from backend this is called optimistic UI update by react u don't need to call get api again
      setStudentData((prev) => prev.filter((student) => student._id !== id));
      toast.success("Student Deleted successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Unable to delete student!");
    }
  };

  // ===========================
  // OPEN EDIT FORM
  // ===========================
  const openEditForm = (student) => {
    setEditStudent(student);
    setShowEditForm(true);

    setNameEM("");
    setRegistrationNumberEM("");
    setSemesterEM("");
  };

  // ===========================
  // UPDATE STUDENT
  // ===========================
  const handleUpdate = async () => {
    //form validation
    const errors = validateStudent(editStudent);
    setNameEM(errors.name || "");
    setRegistrationNumberEM(errors.registrationNumber || "");
    setSemesterEM(errors.semester || "");
    if (Object.keys(errors).length > 0) {
      return;
    }

    const formData = new FormData();
    formData.append("name", editStudent.name);
    formData.append("registrationNumber", editStudent.registrationNumber);
    formData.append("semester", editStudent.semester);
    formData.append("image", editStudent.file);
    for (let pair of formData.entries()) {
      console.log("dani bhi ", pair);
    }

    try {
      const response = await fetch(
        `http://localhost:3000/student/${editStudent._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        },
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
        navigate("/login");
        toast.error("Session Expired");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to update student");
      }
      const data = await response.json();
      toast.success("Student Updated successfully!");
      console.log(data);
      getStudentsFromBackend();

      setShowEditForm(false);
      setEditStudent(null);
    } catch (error) {
      toast.error("Unable to delete student!");
      console.log(error);
    }
  };

  // ===========================
  // USE EFFECT
  // ===========================
  useEffect(() => {
    getStudentsFromBackend();
  }, []);

  //searching code
  const filteredStudents = studentData.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase()),
  );

  let sortedStudents = [...filteredStudents];

  //sorting
  if (sortBy === "az") {
    sortedStudents.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sortBy === "za") {
    sortedStudents.sort((a, b) => b.name.localeCompare(a.name));
  }

  // Pagination
  const studentsPerPage = 5;
  const lastStudentIndex = currentPage * studentsPerPage;
  const firstStudentIndex = lastStudentIndex - studentsPerPage;

  const currentStudents = sortedStudents.slice(
    firstStudentIndex,
    lastStudentIndex,
  );

  const totalPages = Math.ceil(sortedStudents.length / studentsPerPage);

  // =========================================
  //                   UI
  // =========================================

  return (
    <div className="admin-container">
      <h1 className="ADMINH1">Admin Side</h1>

      {/*search UI*/}
      <input
        type="text"
        placeholder="Search Student..."
        className="searchInput"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/*sort UI*/}
      <select
        className="sortSelect"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="">Sort By</option>
        <option value="az">Name A-Z</option>
        <option value="za">Name Z-A</option>
      </select>

      {/*Dashboard Cards*/}
      <div className="dashboardCards">
        <div className="card">
          <h3>👨‍🎓 Total Students</h3>
          <h1>{studentData.length}</h1>
        </div>

        <div className="card">
          <h3>🔍 Search Results</h3>
          <h1>{filteredStudents.length}</h1>
        </div>

        <div className="card">
          <h3>📄 Total Pages</h3>
          <h1>{totalPages}</h1>
        </div>

        <div className="card">
          <h3>📍 Current Page</h3>
          <h1>{currentPage}</h1>
        </div>
      </div>
      {loading ? (
        <div className="loadingContainer">
          <div className="loader"></div>
          <h2 className="loadingText">Loading Students...</h2>
        </div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Registration Number</th>
                <th>Semester</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentStudents.map((student) => (
                <tr key={student._id}>
                  <td>
                    <img
                      className="studentImage"
                      src={`http://localhost:3000/uploads/${student.image}`}
                      alt="Student"
                      onClick={() =>
                        setSelectedImage(
                          `http://localhost:3000/uploads/${student.image}`,
                        )
                      }
                    />
                  </td>

                  <td>{student.name}</td>
                  <td>{student.registrationNumber}</td>
                  <td>{student.semester}</td>

                  <td>
                    <button
                      className="editBtn"
                      onClick={() => openEditForm(student)}
                    >
                      Edit
                    </button>

                    <button
                      className="deleteBtn"
                      onClick={() => {
                        const isConfirmed = window.confirm(
                          "Are you sure you want to delete this student?",
                        );

                        if (isConfirmed) {
                          handleDelete(student._id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedImage && (
            <div className="imageModal" onClick={() => setSelectedImage(null)}>
              <img
                className="previewImage"
                src={selectedImage}
                alt="Preview"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </>
      )}

      {/* ================= update Popup ================= */}

      {showEditForm && (
        <div className="editOverlay">
          <div className="editBox">
            <button
              className="closeBtn"
              onClick={() => {
                setShowEditForm(false);
                setEditStudent(null);
              }}
            >
              ✕
            </button>

            <h2>Edit Student</h2>

            <input
              type="file"
              onChange={(e) =>
                setEditStudent({
                  ...editStudent,
                  file: e.target.files[0],
                })
              }
            />

            {fileEM && <p className="error">{fileEM}</p>}
            <input
              type="text"
              placeholder="Enter Name"
              value={editStudent.name}
              onChange={(e) => {
                setEditStudent({
                  ...editStudent,
                  name: e.target.value,
                });

                setNameEM("");
              }}
            />

            {nameEM && <p className="error">{nameEM}</p>}

            <input
              type="text"
              placeholder="Registration Number"
              value={editStudent.registrationNumber}
              onChange={(e) => {
                setEditStudent({
                  ...editStudent,
                  registrationNumber: e.target.value,
                });

                setRegistrationNumberEM("");
              }}
            />

            {registrationNumberEM && (
              <p className="error">{registrationNumberEM}</p>
            )}

            <input
              type="number"
              placeholder="Semester"
              value={editStudent.semester}
              onChange={(e) => {
                setEditStudent({
                  ...editStudent,
                  semester: e.target.value,
                });

                setSemesterEM("");
              }}
            />

            {semesterEM && <p className="error">{semesterEM}</p>}

            <button type="button" onClick={handleUpdate}>
              Update Student
            </button>

            <button
              type="button"
              onClick={() => {
                setShowEditForm(false);
                setEditStudent(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button key={index} onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Admin;
