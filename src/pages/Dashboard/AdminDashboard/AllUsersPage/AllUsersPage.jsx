// src/pages/Dashboard/Admin/AllUsersPage.jsx
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import UseAuth from "@/Hooks/UseAuth/UseAuth";

const AllUsersPage = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = UseAuth();

  const { data: users = [], refetch } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const handleMakeAdmin = async (userId) => {
    try {
      const res = await axiosSecure.patch(`/users/admin/${userId}`, null, {
        headers: {
          email: user?.email, // required by verifyAdmin middleware
        },
      });

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
    <div>
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u._id} className="border-b">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{u.name || "No name"}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2 capitalize">{u.role || "user"}</td>
                <td className="p-2">
                  {u.role !== "admin" && (
                    <Button onClick={() => handleMakeAdmin(u._id)}>
                      Make Admin
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsersPage;
