import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";

const WorkspaceList = () => {
  const { user } = useAuthContext();
  const [workspaces, setWorkspaces] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name.trim()) return;

    const ref = collection(firestore, "workspaces");
    await addDoc(ref, {
      name,
      createdBy: user.uid,
      members: [user.uid],
      createdAt: new Date(),
    });

    setName("");
  };

  useEffect(() => {
    const q = query(
      collection(firestore, "workspaces"),
      where("members", "array-contains", user.uid)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setWorkspaces(data);
    });

    return () => unsub();
  }, [user.uid]);

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h2>Your Workspaces</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter workspace name"
          style={{ flex: 1, padding: "8px", borderRadius: "4px" }}
        />
        <button
          onClick={handleCreate}
          style={{
            padding: "8px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Create
        </button>
      </div>

      <h3>Workspaces</h3>
      {workspaces.length === 0 ? (
        <p>No workspaces yet. Create one!</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {workspaces.map((ws) => (
            <li
              key={ws.id}
              style={{
                margin: "10px 0",
                padding: "12px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <Link
                to={`/workspace/${ws.id}`}
                className="workspace-item"
                style={{
                  textDecoration: "none",
                  color: "#333",
                  fontWeight: "bold",
                  display: "block",
                }}
              >
                🗂 {ws.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkspaceList;
