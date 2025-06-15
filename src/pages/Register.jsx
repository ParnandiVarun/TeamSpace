import React from "react";
import "./Register.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ You can also add Firebase registration logic here
    // Simulate registration success
    console.log("User registered!");

    // ✅ Redirect to login page after registration
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <h2>Create Your Account</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Register</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
