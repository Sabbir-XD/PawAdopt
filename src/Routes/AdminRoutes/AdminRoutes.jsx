import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { CardSkeleton } from "@/components/Loading/Loading";

const AdminRoutes = ({ children }) => {
  const { user, loading } = UseAuth();
  const axiosSecure = useAxiosSecure();
  const location = useLocation();

  // Fetch user role securely from backend
  const {
    data: dbUser = {},
    isPending,
    isError,
  } = useQuery({
    enabled: !!user?.email,
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  // Show skeleton during auth or query loading
  if (loading || isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        <CardSkeleton count={6} />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Failed to fetch user role (error case)
  if (isError) {
    return (
      <div className="text-center py-10 text-red-500 text-xl font-semibold">
        ⚠️ Error loading user role. Try again later.
      </div>
    );
  }

  // Not an admin
  if (dbUser?.role !== "admin") {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // Is admin
  return children;
};

export default AdminRoutes;
