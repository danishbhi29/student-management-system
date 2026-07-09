import { useState } from "react";
import "./Login.css";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  //states
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setToken } = useContext(AuthContext);

  //login
  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/auth/login", {
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
    console.log("tokken", data.token);

    if (response.ok) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      toast.success("Login successful");
      navigate("/admin");
    } else {
      toast.error("Login not successful");
    }
  };

  return (
    <div className="loginContainer">
      <form className="loginForm" onSubmit={handleLogin}>
        <h2 className="loginTitle">Student Login</h2>

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

        <button className="loginBtn" type="submit">
          Login
        </button>

        <span
          style={{
            display: "block",textAlign: "center",color: "blue",cursor: "pointer",}}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Pasword
        </span>

        <p  style={{ display: "block",textAlign: "center",color: "blue", cursor: "pointer" }}>
          If don't have Account Try?
          <span
            style={{color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
