import React from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-bg">
        <nav className="dashboard-nav">
          <h2>TeamSpace</h2>
          <div className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/workspace/123">Workspace</Link>
            <Link to="/workspace/123/tasks">Task Board</Link>
            <Link to="/login">Logout</Link>
          </div>
        </nav>

        <div className="dashboard-container">
          <h1>Welcome to TeamSpace 🚀</h1>
          <p>
            Collaborate, plan tasks, and stay productive with your teams in one
            unified workspace.
          </p>
          <Link to="/workspace/123" className="dashboard-btn">
            Go to Workspace
          </Link>
        </div>
      </div>

      <footer className="dashboard-footer">
        <p>&copy; 2025 TeamSpace. All rights reserved.</p>
        <p>Contact: support@teamspace.app | Phone: +91 98765 43210</p>
        <p>
          Have queries? Visit our <Link to="/faq">FAQ</Link> or{" "}
          <Link to="/contact">Contact Page</Link>.
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
