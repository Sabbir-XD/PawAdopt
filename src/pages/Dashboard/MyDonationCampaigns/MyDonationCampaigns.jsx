import { useState } from "react";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Modal from "@/components/ui/Modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
      <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>
    );
  if (isError)
    return (
      <div className="text-center text-red-500 dark:text-red-400">
        Failed to load campaigns
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center text-emerald-600 dark:text-emerald-400 mb-6">
        My Donation Campaigns
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg bg-white dark:bg-gray-900 shadow-md">
          <thead>
            <tr className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
              <th className="p-3 text-left">Pet Name</th>
              <th className="p-3 text-left">Max Donation</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Progress</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => {
              const percentage = Math.min(
                (campaign.totalDonated / campaign.maxDonationAmount) * 100,
                100
              ).toFixed(0);

              return (
                <tr
                  key={campaign._id}
                  className="border-t border-gray-300 dark:border-gray-700"
                >
                  <td className="p-3 font-medium text-gray-900 dark:text-gray-200">
                    {campaign.petName || "N/A"}
                  </td>
                  <td className="p-3 text-gray-800 dark:text-gray-300">
                    ${campaign.maxDonationAmount}
                  </td>
                  <td className="p-3">
                    <img
                      src={campaign?.imageUrl}
                      alt="pet"
                      className="h-12 w-12 rounded object-cover border border-gray-200 dark:border-gray-700"
                    />
                  </td>
                  <td className="p-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded h-4">
                      <div
                        className="h-4 bg-emerald-500 dark:bg-emerald-400 rounded transition-all duration-500 ease-in-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      ${campaign.totalDonated || 0} raised
                    </div>
                  </td>
                  <td className="p-3 space-x-2">
                    <Button
                      onClick={() => togglePause(campaign._id, campaign.paused)}
                      className={`px-3 py-1 text-sm ${
                        campaign.paused ? "bg-yellow-500" : "bg-red-500"
                      } text-white rounded hover:opacity-90 transition`}
                    >
                      {campaign.paused ? "Resume" : "Pause"}
                    </Button>

                    <Button
                      onClick={() =>
                        navigate(`/dashboard/edit-donation/${campaign._id}`)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded transition"
                    >
                      Edit
                    </Button>

                    <Button
                      onClick={() => viewDonators(campaign._id)}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 text-sm rounded transition"
                    >
                      View Donators
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Donators Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Donators List"
      >
        {selectedDonators.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No donations yet.</p>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {selectedDonators.map((donor, idx) => (
              <li
                key={idx}
                className="flex justify-between border-b border-gray-300 dark:border-gray-700 py-1 text-sm text-gray-800 dark:text-gray-200"
              >
                <span>{donor.name || donor.email}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
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
