import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export const createWorkspace = async (user, name) => {
  const workspaceRef = collection(db, "workspaces");
  const newWorkspace = {
    name,
    createdBy: user.uid,
    createdAt: serverTimestamp(),
    members: [{ uid: user.uid, email: user.email, role: "admin" }],
  };
  const docRef = await addDoc(workspaceRef, newWorkspace);
  return docRef.id;
};

export const getUserWorkspaces = async (uid) => {
  const workspaceRef = collection(db, "workspaces");
  const q = query(workspaceRef, where("members", "array-contains", { uid })); // Firestore doesn't allow direct object array match, will fix this later
  const snapshot = await getDocs(q);
  const workspaces = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return workspaces;
};
