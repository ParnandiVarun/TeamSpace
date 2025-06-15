import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TaskBoard from "../components/TaskBoard";
import InviteMember from "../components/InviteMember";

const WorkspaceDetail = () => {
  const { id } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [memberEmails, setMemberEmails] = useState([]);

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const docRef = doc(firestore, "workspaces", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const workspaceData = docSnap.data();
          setWorkspace(workspaceData);

          // Fetch email IDs of members from their UIDs
          if (workspaceData.members && workspaceData.members.length > 0) {
            const memberEmailsArr = [];

            for (const uid of workspaceData.members) {
              const userRef = doc(firestore, "users", uid);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                const userData = userSnap.data();
                memberEmailsArr.push(userData.email);
              }
            }

            setMemberEmails(memberEmailsArr);
          }
        } else {
          console.log("No such workspace!");
        }
      } catch (err) {
        console.error("Error loading workspace:", err.message);
      }
    };

    fetchWorkspace();
  }, [id]);

  if (!workspace) return <p>Loading workspace...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Workspace: {workspace.name}</h2>
      <p>
        <strong>Created By:</strong> {workspace.createdBy}
      </p>
      <p>
        <strong>Created At:</strong>{" "}
        {workspace.createdAt?.toDate().toLocaleString()}
      </p>

      <h3>Members:</h3>
      <ul>
        {memberEmails.length > 0 ? (
          memberEmails.map((member, index) => (
            <li key={index} style={{ marginBottom: "0.5rem" }}>
              {member.email}{" "}
              <span
                style={{
                  backgroundColor:
                    member.uid === workspace.createdBy ? "#4CAF50" : "#888",
                  color: "white",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  marginLeft: "0.5rem",
                }}
              >
                {member.uid === workspace.createdBy ? "Owner" : "Member"}
              </span>
            </li>
          ))
        ) : (
          <p>No members yet.</p>
        )}
      </ul>
      <hr style={{ margin: "2rem 0" }} />

      {/* 👇 Task Board Section */}
      <TaskBoard workspaceId={id} members={memberEmails} />
      <InviteMember workspaceId={workspaceId} />
    </div>
  );
};

export default WorkspaceDetail;
