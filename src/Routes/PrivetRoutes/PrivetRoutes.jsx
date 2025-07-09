import React from "react";
import { Navigate, useLocation } from "react-router";
import { CardSkeleton } from "@/components/Loading/Loading";
import UseAuth from "@/Hooks/UseAuth/UseAuth";

const PrivetRoute = ({ children }) => {
  const { user, loading } = UseAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        <CardSkeleton count={6} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={location?.pathname} replace />;
  }

  return children;
};

export default PrivetRoute;
