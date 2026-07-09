import { useState } from "react";
import "./Login.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Register() {
  //states
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [matchPassword, setMatchPassword] = useState("");
  const [emailExsist , setEmailExsist] = useState("");

  //login
  const handleRegister = async (e) => {
    e.preventDefault();

    setMatchPassword("");
    setEmailExsist("");


    //just small validation for now
    if (password !== confirmPassword) {
      setMatchPassword("Password Mismatch");
      return;
    }

    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    console.log(data.message);

    if (response.ok) {
      toast.success("Register successful");
      navigate("/login");
    } else {
      setEmailExsist(data.message);
      toast.error("Register not successful");
    }
  };

  return (
    <div className="loginContainer">
      <form className="loginForm" onSubmit={handleRegister}>
        <h2 className="loginTitle">Student Register</h2>

        {/* Email */}

        <div className="inputBox">
          <span className="inputIcon">📧</span>

          <input
            className="loginInput"
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
         {emailExsist && <p>{emailExsist}</p>}
        {/* Password */}

        <div className="inputBox">
          <span className="inputIcon">🔒</span>

          <input
            className="loginInput"
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="showBtn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <div className="inputBox">
          <span className="inputIcon">🔒</span>

          <input
            className="loginInput"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className="showBtn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {matchPassword && <p>{matchPassword}</p>}

        <button className="loginBtn" type="submit">
          Register
        </button>

        <p>
          Already have an account?
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;
