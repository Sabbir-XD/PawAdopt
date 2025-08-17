import { useState } from "react";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Modal from "@/components/ui/Modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiPause, FiPlay, FiEdit2, FiUsers, FiDollarSign } from "react-icons/fi";
const MyDonationCampaigns = () => {
  const [selectedDonators, setSelectedDonators] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user } = UseAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch campaigns
  const {
    data: campaigns = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["donation-campaigns", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donation-user-campaigns?email=${user?.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Mutation for toggling pause/resume
  const pauseMutation = useMutation({
    mutationFn: async ({ id, currentStatus }) => {
      await axiosSecure.patch(`/donations-campaigns/${id}/pause`, {
        paused: !currentStatus,
      });
    },
    onSuccess: () => {
      toast.success("Campaign status updated");
      queryClient.invalidateQueries(["donation-campaigns", user?.email]);
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const togglePause = (id, currentStatus) => {
    pauseMutation.mutate({ id, currentStatus });
  };

  // Load Donators
  const viewDonators = async (id) => {
    try {
      const res = await axiosSecure.get(`/donations-campaigns/${id}/donators`);
      setSelectedDonators(res.data || []);
      setModalOpen(true);
    } catch {
      toast.error("Failed to load donators");
    }
  };

  if (isLoading)
    return (
      <div className="grid gap-4 p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );

  if (isError)
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-4 rounded-lg border border-red-200 dark:border-red-800 text-center">
        Failed to load campaigns. Please try again later.
      </div>
    );

  if (!isLoading && !isError && campaigns.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4 text-center">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <svg
            className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
            No campaigns found
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            You haven't created any donation campaigns yet.
          </p>
          <div className="mt-4">
            <Button
              size="sm"
              onClick={() => navigate("/dashboard/create-donation")}
            >
              Create New Campaign
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
          My Donation Campaigns
        </h2>
        <Button
          size="sm"
          onClick={() => navigate("/dashboard/create-donation")}
          className="w-full sm:w-auto"
        >
          Create New
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-emerald-50 dark:bg-emerald-900/30">
                <tr>
                  <th className="p-2 sm:p-3 text-left text-emerald-700 dark:text-emerald-300">
                    Pet Name
                  </th>
                  <th className="p-2 sm:p-3 text-left text-emerald-700 dark:text-emerald-300">
                    Max Amount
                  </th>
                  <th className="p-2 sm:p-3 text-left text-emerald-700 dark:text-emerald-300">
                    Image
                  </th>
                  <th className="p-2 sm:p-3 text-left text-emerald-700 dark:text-emerald-300">
                    Progress
                  </th>
                  <th className="p-2 sm:p-3 text-left text-emerald-700 dark:text-emerald-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {campaigns.map((campaign) => {
                  const percentage = Math.min(
                    (campaign.totalDonated / campaign.maxDonationAmount) * 100,
                    100
                  ).toFixed(0);

                  return (
                    <tr
                      key={campaign._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="p-2 sm:p-3 font-medium text-gray-900 dark:text-gray-200 max-w-[120px] sm:max-w-none truncate">
                        {campaign.petName || "N/A"}
                      </td>
                      <td className="p-2 sm:p-3 text-gray-800 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <FiDollarSign className="h-3 w-3" />
                          {campaign.maxDonationAmount}
                        </div>
                      </td>
                      <td className="p-2 sm:p-3">
                        <img
                          src={campaign?.imageUrl}
                          alt="pet"
                          className="h-8 w-8 sm:h-10 sm:w-10 rounded object-cover border border-gray-200 dark:border-gray-700"
                        />
                      </td>
                      <td className="p-2 sm:p-3">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded h-2.5 sm:h-3">
                          <div
                            className="h-2.5 sm:h-3 bg-emerald-500 dark:bg-emerald-400 rounded transition-all duration-500 ease-in-out"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-1">
                          ${campaign.totalDonated || 0} raised
                        </div>
                      </td>
                      <td className="p-2 sm:p-3">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Button
                            size="icon"
                            onClick={() =>
                              togglePause(campaign._id, campaign.paused)
                            }
                            className={`h-7 w-7 sm:h-8 sm:w-8 ${
                              campaign.paused
                                ? "bg-emerald-500 hover:bg-emerald-600"
                                : "bg-yellow-500 hover:bg-yellow-600"
                            }`}
                            title={campaign.paused ? "Resume" : "Pause"}
                          >
                            {campaign.paused ? (
                              <FiPlay className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            ) : (
                              <FiPause className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            )}
                          </Button>

                          <Button
                            size="icon"
                            onClick={() =>
                              navigate(
                                `/dashboard/edit-donation/${campaign._id}`
                              )
                            }
                            className="h-7 w-7 sm:h-8 sm:w-8 bg-blue-500 hover:bg-blue-600"
                            title="Edit"
                          >
                            <FiEdit2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </Button>

                          <Button
                            size="icon"
                            onClick={() => viewDonators(campaign._id)}
                            className="h-7 w-7 sm:h-8 sm:w-8 bg-purple-500 hover:bg-purple-600"
                            title="Donators"
                          >
                            <FiUsers className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Donators Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Donators List"
        size="sm"
      >
        {selectedDonators.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-400">
              No donations received yet.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[60vh] overflow-y-auto">
            {selectedDonators.map((donor, idx) => (
              <li
                key={idx}
                className="py-2 px-1 flex justify-between items-center"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                    {donor.name || "Anonymous"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {donor.email}
                  </p>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 ml-2 whitespace-nowrap">
                  ${donor.amount}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
};

export default MyDonationCampaigns;