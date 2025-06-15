import React from "react";
import { useAuthContext } from "../context/AuthContext";
import WorkspaceList from "../components/WorkspaceList"; // ✅ import the component

const Dashboard = () => {
  const { user, logout } = useAuthContext();

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <button onClick={logout}>Logout</button>

      <hr />

      {/* ✅ Workspace Creation & List */}
      <WorkspaceList />
    </div>
  );
};

export default Dashboard;
