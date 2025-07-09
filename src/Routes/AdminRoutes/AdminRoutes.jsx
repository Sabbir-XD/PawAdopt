import React from "react";
import { Navigate, useLocation } from "react-router";
import { CardSkeleton } from "@/components/Loading/Loading";
import UseAuth from "@/Hooks/UseAuth/UseAuth";

const AdminRoutes = ({ children }) => {
  const { user, loading } = UseAuth();
  const location = useLocation();

  // While loading, show skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        <CardSkeleton count={6} />
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }

  // If logged in but not admin
  if (user?.role !== "admin") {
    return (
      <div className="text-center py-10 text-red-500 text-xl font-semibold">
        ❌ Access Denied: Admins Only
      </div>
    );
  }

  // If admin, allow access
  return children;
};

export default AdminRoutes;
