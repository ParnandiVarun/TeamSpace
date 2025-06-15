// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, firestore } from "../firebase/firebase"; // 🔁 Make sure firestore is exported
import { doc, getDoc, setDoc } from "firebase/firestore"; // ✅ Firestore methods

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register user
  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  // Login user
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // Logout user
  const logout = () => signOut(auth);

  // Track auth state and create Firestore user doc
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // ✅ Create Firestore user document if it doesn't exist
        const userRef = doc(firestore, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            email: currentUser.email,
            createdAt: new Date(),
          });
          console.log("📄 New user document created in Firestore.");
        } else {
          console.log("✅ User already exists in Firestore.");
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, register, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuthContext = () => useContext(AuthContext);
