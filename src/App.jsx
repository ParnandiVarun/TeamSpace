// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import WorkspaceDetail from "./pages/WorkspaceDetail";
import Error404 from "./pages/Error404";
import ProtectedRoute from "./routes/ProtectedRoute";
import TaskBoard from "./components/TaskBoard"; // ✅ Correct
// Adjust if this path is different
import { useParams } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workspace/:id" element={<WorkspaceDetail />} />
          <Route path="/workspace/:id/tasks" element={<TaskBoardWrapper />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}

export default App;

// ✅ Only ONE definition of TaskBoardWrapper
function TaskBoardWrapper() {
  const { id } = useParams();
  return <TaskBoard workspaceId={id} />;
}
