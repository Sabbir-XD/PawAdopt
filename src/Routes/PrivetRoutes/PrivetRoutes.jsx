import UseAuth from "@/Hooks/UseAuth/UseAuth";
import React from "react";
import { Navigate, useLocation } from "react-router";

const PrivetRoutes = ({ children }) => {
  const { user, loading } = UseAuth();
  const location = useLocation();

  if (loading) {
    return;
  }
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={location?.pathname}
        replace={true}
      ></Navigate>
    );
  }
  return children;
};

export default PrivetRoutes;
