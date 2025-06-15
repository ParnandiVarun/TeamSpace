import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    // Simulate success – replace with Firebase logic
    if (email && password) {
      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } else {
      alert("Please enter both email and password");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login to TeamSpace</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" required />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
