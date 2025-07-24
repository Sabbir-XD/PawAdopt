import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import { TableRowSkeleton } from "@/components/Loading/Loading";

const AllUsersPage = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = UseAuth();

  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch users with pagination params
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["allUsers", page],
    queryFn: async () => {
      const res = await axiosSecure.get("/users", {
        params: { page, limit },
      });
      return res.data; // { users: [], totalUsers: number }
    },
    keepPreviousData: true,
  });

  const users = data?.users || [];
  const totalUsers = data?.totalUsers || 0;
  const totalPages = Math.ceil(totalUsers / limit);

  const handleMakeAdmin = async (userId) => {
    try {
      const res = await axiosSecure.patch(
        `/users/admin/${userId}`,
        null,
        {
          headers: {
            email: user?.email, // verifyAdmin middleware জন্য
          },
        }
      );

      if (res.data.modifiedCount > 0) {
        toast.success("Promoted to admin");
        refetch();
      }
    } catch (err) {
      console.error("Make admin error:", err.response || err);
      toast.error("Failed to promote. You may not have permission.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-teal-600">
        All Users
      </h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  <TableRowSkeleton columns={5} />
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-red-600">
                  Error loading users.
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u, index) => (
                <tr
                  key={u._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {u.name || "No name"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {u.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {u.role || "user"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {u.role !== "admin" && (
                      <Button
                        onClick={() => handleMakeAdmin(u._id)}
                        className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 text-white"
                      >
                        Make Admin
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-6">
        <Button
          disabled={page === 1}
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 text-white"
        >
          Previous
        </Button>

        <span className="text-gray-700 dark:text-gray-300">
          Page {page} of {totalPages}
        </span>

        <Button
          disabled={page === totalPages}
          onClick={() => setPage((old) => Math.min(old + 1, totalPages))}
          className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 text-white"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AllUsersPage;
