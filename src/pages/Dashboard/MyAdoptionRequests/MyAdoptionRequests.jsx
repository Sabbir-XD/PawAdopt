import { useQuery } from "@tanstack/react-query";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { toast } from "react-toastify";
import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaCheck, FaTimes } from "react-icons/fa";

const MyAdoptionRequests = () => {
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();
  const [loadingId, setLoadingId] = useState(null);

  const { data: requests = [], refetch } = useQuery({
    queryKey: ["myAdoptionRequests", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/adoptions?email=${user.email}`);
      return res.data;
    },
  });

  const handleUpdateStatus = async (id, status) => {
    try {
      setLoadingId(id);
      const res = await axiosSecure.patch(`/adoptions/${id}`, { status });
      if (res.data.modifiedCount > 0) {
        toast.success(`Request ${status} successfully!`);
        refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="px-4 md:px-10 py-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-neutral-800 mb-6">Adoption Requests</h2>

      {requests.length === 0 ? (
        <p className="text-gray-500">No adoption requests found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-md">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Pet</th>
                <th className="px-6 py-3">Requester</th>
                <th className="px-6 py-3">Address</th>
                <th className="px-6 py-3">Requested On</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {requests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50 transition duration-200">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    <img
                      src={req.petImage}
                      alt={req.petName}
                      className="w-12 h-12 object-cover rounded border"
                    />
                    <span className="font-medium text-gray-700">{req.petName}</span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-800">{req.userName}</div>
                    <div className="text-xs text-gray-500">{req.email}</div>
                    <div className="text-xs text-gray-500">{req.phone}</div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">{req.address}</td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(req.timestamp).toLocaleDateString()}<br />
                    <span className="text-xs text-gray-400">
                      {new Date(req.timestamp).toLocaleTimeString()}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        req.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : req.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    {req.status === "pending" ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleUpdateStatus(req._id, "accepted")}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold bg-green-600 text-white rounded hover:bg-green-700 transition"
                          disabled={loadingId === req._id}
                        >
                          {loadingId === req._id ? "..." : <FaCheck />} Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req._id, "rejected")}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold bg-red-600 text-white rounded hover:bg-red-700 transition"
                          disabled={loadingId === req._id}
                        >
                          {loadingId === req._id ? "..." : <FaTimes />} Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs italic text-gray-400">No action</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyAdoptionRequests;
