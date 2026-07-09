import Form from "./components/form";
import Admin from "./components/adminside";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeProvider, { ThemeContext } from "./context/ThemeContext";
import { useContext } from "react";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { useNavigate } from "react-router-dom";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import Register from "./components/Register";
import { useState } from "react";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPasword";
import { useParams } from "react-router-dom";

// =========================================
// Main App Content
// =========================================

function AppContent() {
  //all states
  const { theme, setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { token, setToken } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const { resetToken } = useParams();

  const handleLogout = () => {
    localStorage.removeItem("token"); // 👈 Ye missing hai
    setToken(null);
    toast.success("Logout Successful");
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navLinks">
          {!token && (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          )}

          {token && (
            <>
              <Link to="/">Home</Link>
              <Link to="/admin">Admin</Link>
            </>
          )}
        </div>
        <div className="rightSection">
          {user && (
            <div className="userInfo">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> 🛡️ {user.role}
              </p>
            </div>
          )}

          <button className="themeBtn" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <button className="logoutBtn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <Routes>
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Form />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password/:resetToken"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />


      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}

// =========================================
// Root App
// =========================================

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
