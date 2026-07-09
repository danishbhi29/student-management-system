import { useState } from "react";
import { Link } from "react-router-dom";
function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
     
    if(!email){
        return;
    }
    
    const response = await fetch("http://localhost:3000/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    const data = await response.json();

    console.log(data);
    // yahan backend ko request bhejenge
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="formTitle">Forgot Password</h1>

        <label>Email</label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Send Reset Link</button>
        <Link
          to="/login"
          style={{
            display: "block",
            textAlign: "center",
            color: "blue",
            cursor: "pointer",
          }}
        >
          {" "}
          Try login
        </Link>
      </form>
    </div>
  );
}

export default ForgotPassword;
