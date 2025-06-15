import { useState } from "react";
import { firestore } from "../firebase/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import "./InviteMember.css";

const InviteMember = ({ workspaceId, existingMembers }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleInvite = async () => {
    if (!email.trim()) {
      setMessage("Email cannot be empty.");
      return;
    }

    if (existingMembers.includes(email)) {
      setMessage("This user is already a member.");
      return;
    }

    try {
      const workspaceRef = doc(firestore, "workspaces", workspaceId);
      await updateDoc(workspaceRef, {
        members: arrayUnion({ email, role: "Member" }),
      });
      setMessage("Invitation sent!");
      setEmail("");
    } catch (err) {
      console.error("Failed to invite:", err);
      setMessage("Failed to send invite.");
    }
  };

  return (
    <div className="invite-member-container">
      <h3>Invite Member</h3>
      <div className="invite-member-form">
        <input
          type="email"
          placeholder="Enter member email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="invite-member-input"
        />
        <button onClick={handleInvite} className="invite-member-button">
          Invite
        </button>
      </div>
      {message && <p className="invite-message">{message}</p>}
    </div>
  );
};

export default InviteMember;
