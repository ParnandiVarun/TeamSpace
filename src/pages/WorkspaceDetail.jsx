import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TaskBoard from "../components/TaskBoard";
import InviteMember from "../components/InviteMember";
import "./WorkspaceDetail.css";

const WorkspaceDetailWrapper = () => {
  const { id } = useParams();
  return <WorkspaceDetail id={id} />;
};

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

          if (workspaceData.members && workspaceData.members.length > 0) {
            const memberEmailsArr = [];

            for (const uid of workspaceData.members) {
              const userRef = doc(firestore, "users", uid);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                const userData = userSnap.data();
                memberEmailsArr.push({ email: userData.email, uid });
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
    <div className="workspace-detail">
      <h2>Workspace: {workspace.name}</h2>
      <p>
        <strong>Created By:</strong> {workspace.createdBy}
      </p>
      <p>
        <strong>Created At:</strong>{" "}
        {workspace.createdAt?.toDate().toLocaleString()}
      </p>

      <h3>Members:</h3>
      <ul className="member-list">
        {memberEmails.length > 0 ? (
          memberEmails.map((member, index) => (
            <li key={index} className="member-item">
              {member.email}
              <span
                className={`member-role ${
                  member.uid === workspace.createdBy ? "owner" : ""
                }`}
              >
                {member.uid === workspace.createdBy ? "Owner" : "Member"}
              </span>
            </li>
          ))
        ) : (
          <p>No members yet.</p>
        )}
      </ul>

      <hr className="section-divider" />

      {/* Task Board & Invite */}
      <TaskBoard workspaceId={id} members={memberEmails} />
      <InviteMember workspaceId={id} />
    </div>
  );
};

export default WorkspaceDetail;
