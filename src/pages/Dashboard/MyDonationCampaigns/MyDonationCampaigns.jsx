import { useEffect, useState } from "react";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Modal from "@/components/ui/Modal"; // make sure this exists

const MyDonationCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedDonators, setSelectedDonators] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user } = UseAuth();
  const navigate = useNavigate();


  const {
    data: donationCampaigns = [],
    refetch: fetchCampaigns,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["donationCampaigns", axiosSecure.get(`/donations-campaigns?email=${user.email}`)],
    queryFn: () => (user?.email),
    enabled: !!user?.email,
  });

  if(isLoading) {
    return <div>Loading...</div>
  }

//   const fetchCampaigns = async () => {
//     try {
//       const res = await axiosSecure.get(`/donations-campaigns?email=${user.email}`);
//       setCampaigns(res.data);
//     } catch {
//       toast.error("Failed to load donation campaigns");
//     }
//   };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const togglePause = async (id, currentStatus) => {
    try {
      await axiosSecure.patch(`/donations-campaigns/${id}/pause`, {
        paused: !currentStatus,
      });
      toast.success(`Campaign ${!currentStatus ? "paused" : "resumed"}`);
      fetchCampaigns();
    } catch {
      toast.error("Failed to update pause status");
    }
  };

  const viewDonators = async (id) => {
    try {
      const res = await axiosSecure.get(`/donations-campaigns/${id}/donators`);
      setSelectedDonators(res.data);
      setModalOpen(true);
    } catch {
      toast.error("Failed to load donators");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center text-emerald-600 mb-6">
        My Donation Campaigns
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg bg-white shadow-md">
          <thead>
            <tr className="bg-emerald-100 text-emerald-700">
              <th className="p-3 text-left">Pet Name</th>
              <th className="p-3 text-left">Max Donation</th>
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
                <tr key={campaign._id} className="border-t">
                  <td className="p-3 font-medium">{campaign.petName || "N/A"}</td>
                  <td className="p-3">${campaign.maxDonationAmount}</td>
                  <td className="p-3">
                    <div className="w-full bg-gray-200 rounded h-4">
                      <div
                        className="h-4 bg-emerald-500 rounded"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      ${campaign.totalDonated} raised
                    </div>
                  </td>
                  <td className="p-3 space-x-2">
                    <Button
                      onClick={() => togglePause(campaign._id, campaign.paused)}
                      className={`px-3 py-1 text-sm ${
                        campaign.paused ? "bg-yellow-500" : "bg-red-500"
                      } text-white rounded`}
                    >
                      {campaign.paused ? "Resume" : "Pause"}
                    </Button>

                    <Button
                      onClick={() => navigate(`/dashboard/edit-donation/${campaign._id}`)}
                      className="bg-blue-500 text-white px-3 py-1 text-sm rounded"
                    >
                      Edit
                    </Button>

                    <Button
                      onClick={() => viewDonators(campaign._id)}
                      className="bg-purple-500 text-white px-3 py-1 text-sm rounded"
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
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)} title="Donators List">
          {selectedDonators.length === 0 ? (
            <p className="text-gray-600">No donations yet.</p>
          ) : (
            <ul className="space-y-2">
              {selectedDonators.map((donor, idx) => (
                <li
                  key={idx}
                  className="flex justify-between border-b py-1 text-sm"
                >
                  <span>{donor.name || donor.email}</span>
                  <span className="font-semibold text-emerald-600">
                    ${donor.amount}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}
    </div>
  );
};

export default MyDonationCampaigns;
