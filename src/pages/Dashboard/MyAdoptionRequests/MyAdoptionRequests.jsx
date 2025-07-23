import { useQuery } from "@tanstack/react-query";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { toast } from "react-toastify";
import { useState } from "react";
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

  if (requests.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500 dark:text-gray-400">
        No adoption requests found.
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-neutral-800 dark:text-teal-500">
        Adoption Requests for Your Pets
      </h2>

      {/* Large screen: Table */}
      <div className="hidden lg:block  border border-gray-200 dark:border-gray-700 rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm md:text-base lg:text-lg">
          <thead className="bg-gray-50 dark:bg-gray-800 text-left text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3">Pet</th>
              <th className="px-6 py-3">Requester Info</th>
              <th className="px-5 py-3">Address</th>
              <th className="px-5 py-3">Requested On</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
            {requests.map((req) => (
              <tr
                key={req._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3 max-w-[180px]">
                  <img
                    src={req.petImage}
                    alt={req.petName}
                    className="w-12 h-12 object-cover rounded border dark:border-gray-700 flex-shrink-0"
                  />
                  <span className="font-medium text-gray-700 dark:text-gray-200 truncate max-w-[120px]">
                    {req.petName}
                  </span>
                </td>

                <td className="px-6 py-4 max-w-[220px]">
                  <div className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 truncate">
                    {req.userName}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
                    {req.email}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
                    {req.phone}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm md:text-base text-gray-700 dark:text-gray-300 max-w-[160px] truncate">
                  {req.address}
                </td>

                <td className="px-6 py-4 text-sm md:text-base text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {new Date(req.timestamp).toLocaleDateString()} <br />
                  <span className="text-xs md:text-sm text-gray-400 dark:text-gray-500">
                    {new Date(req.timestamp).toLocaleTimeString()}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
                      req.status === "accepted"
                        ? "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900"
                        : req.status === "rejected"
                        ? "bg-red-100 text-red-700 dark:bg-red-200 dark:text-red-900"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900"
                    }`}
                  >
                    {req.status || "pending"}
                  </span>
                </td>

                <td className="px-6 py-4 text-center whitespace-nowrap">
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
                    <span className="text-xs italic text-gray-400 dark:text-gray-500">
                      No action
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: Card list */}
      <div className="lg:hidden space-y-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow bg-white dark:bg-gray-900"
          >
            <div className="flex items-center gap-4 mb-3">
              <img
                src={req.petImage}
                alt={req.petName}
                className="w-16 h-16 object-cover rounded border dark:border-gray-700 flex-shrink-0"
              />
              <div className="flex flex-col flex-grow">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 truncate">
                  {req.petName}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  Requested on:{" "}
                  {new Date(req.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mb-2">
              <p className="font-medium text-gray-700 dark:text-gray-300 truncate">
                Requester: {req.userName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                Email: {req.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                Phone: {req.phone}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                Address: {req.address}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  req.status === "accepted"
                    ? "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900"
                    : req.status === "rejected"
                    ? "bg-red-100 text-red-700 dark:bg-red-200 dark:text-red-900"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900"
                }`}
              >
                {req.status || "pending"}
              </span>

              {req.status === "pending" ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(req._id, "accepted")}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold bg-green-600 text-white rounded hover:bg-green-700 transition"
                    disabled={loadingId === req._id}
                  >
                    {loadingId === req._id ? "..." : <FaCheck />}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(req._id, "rejected")}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold bg-red-600 text-white rounded hover:bg-red-700 transition"
                    disabled={loadingId === req._id}
                  >
                    {loadingId === req._id ? "..." : <FaTimes />}
                  </button>
                </div>
              ) : (
                <span className="text-xs italic text-gray-400 dark:text-gray-500">
                  No action
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAdoptionRequests;
