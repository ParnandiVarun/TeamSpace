import { useEffect, useState } from "react";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import "./TaskBoard.css"; // External CSS for styling

const TaskBoard = ({ workspaceId }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [uidToEmailMap, setUidToEmailMap] = useState({});
  const [workspace, setWorkspace] = useState(null);
  const [filterEmail, setFilterEmail] = useState("");

  // Fetch workspace members for assignment dropdown
  useEffect(() => {
    const fetchWorkspace = async () => {
      const docRef = doc(firestore, "workspaces", workspaceId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setWorkspace(data);

        const map = {};
        for (const uid of data.members || []) {
          const userSnap = await getDoc(doc(firestore, "users", uid));
          if (userSnap.exists()) {
            const user = userSnap.data();
            map[uid] = user.email;
          }
        }
        setUidToEmailMap(map);
      }
    };
    fetchWorkspace();
  }, [workspaceId]);

  // Real-time task listener
  useEffect(() => {
    const q = query(
      collection(firestore, `workspaces/${workspaceId}/tasks`),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(data);
    });

    return () => unsub();
  }, [workspaceId]);

  const handleAddTask = async () => {
    if (!title.trim()) return;

    await addDoc(collection(firestore, `workspaces/${workspaceId}/tasks`), {
      title,
      status: "todo",
      dueDate: dueDate ? new Date(dueDate) : null,
      assignedTo,
      createdAt: new Date(),
    });

    setTitle("");
    setDueDate("");
    setAssignedTo("");
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    const taskRef = doc(firestore, `workspaces/${workspaceId}/tasks`, taskId);
    await updateDoc(taskRef, { status: newStatus });
  };

  const handleDeleteTask = async (taskId) => {
    await deleteDoc(doc(firestore, `workspaces/${workspaceId}/tasks`, taskId));
  };

  const renderColumn = (status) => (
    <div className="task-column">
      <h3>{status.toUpperCase()}</h3>
      {tasks
        .filter(
          (task) =>
            task.status === status &&
            (!filterEmail || task.assignedTo === filterEmail)
        )
        .map((task) => (
          <div key={task.id} className="task-card">
            <p>
              <strong>{task.title}</strong>
            </p>
            {task.assignedTo && (
              <p className="assigned-to">Assigned: {task.assignedTo}</p>
            )}
            {task.dueDate && (
              <p className="due-date">
                Due:{" "}
                {new Date(task.dueDate.seconds * 1000).toLocaleDateString()}
              </p>
            )}
            <div className="task-actions">
              {status !== "todo" && (
                <button onClick={() => updateTaskStatus(task.id, "todo")}>
                  To Do
                </button>
              )}
              {status !== "inprogress" && (
                <button onClick={() => updateTaskStatus(task.id, "inprogress")}>
                  In Progress
                </button>
              )}
              {status !== "done" && (
                <button onClick={() => updateTaskStatus(task.id, "done")}>
                  Done
                </button>
              )}
              <button
                className="delete-btn"
                onClick={() => handleDeleteTask(task.id)}
              >
                🗑
              </button>
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <div className="task-board">
      <h2>Task Board</h2>

      <div className="task-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Assign to...</option>
          {Object.values(uidToEmailMap).map((email, i) => (
            <option key={i} value={email}>
              {email}
            </option>
          ))}
        </select>
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {/* Filter Dropdown */}
      <div style={{ margin: "1rem 0" }}>
        <label htmlFor="filter">Filter by Assignee: </label>
        <select
          id="filter"
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">Show All</option>
          {Object.values(uidToEmailMap).map((email, i) => (
            <option key={i} value={email}>
              {email}
            </option>
          ))}
        </select>
      </div>

      <div className="task-columns">
        {renderColumn("todo")}
        {renderColumn("inprogress")}
        {renderColumn("done")}
      </div>
    </div>
  );
};

export default TaskBoard;
