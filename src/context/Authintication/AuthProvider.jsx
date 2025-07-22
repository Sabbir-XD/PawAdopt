import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../../firebase.init";
import { toast } from "react-toastify";
import axios from "axios";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const provider = new GoogleAuthProvider();
  const GithubProvider = new GithubAuthProvider();

  const handleGoogleLoginUser = () => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  const handleGitHubLoginUser = () => {
    return signInWithPopup(auth, GithubProvider);
  };

  const handleCreateUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const handleUpdateProfile = (profileData) => {
    setLoading(true);
    return updateProfile(auth.currentUser, profileData);
  };

  const handleLoginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const handleLogoutUser = async () => {
    setLoading(true);
    try {
      // ✅ Optional Firebase logout (if using Firebase Auth)
      await signOut(auth);
      setUser(null);

      toast.success("Signed out successfully!");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser?.email) {
        // ✅ Send JWT request (must be after saving user)
        axios
          .post(
            "https://assaignment-12-backend-ih48mopag-sabbir-xds-projects.vercel.app/jwt",
            { email: currentUser?.email },
            { withCredentials: true }
          )
          .then((res) => {
            // console.log("token after jWT", res.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
    return () => unsubscribe();
  }, []);

  const userInfo = {
    user,
    setUser,
    loading,
    setLoading,
    handleCreateUser,
    handleUpdateProfile,
    handleLoginUser,
    handleGoogleLoginUser,
    handleGitHubLoginUser,
    handleLogoutUser,
  };

  return (
    <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
