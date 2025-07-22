import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { FaDonate } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { CardSkeleton } from "../Loading/Loading";
import axios from "axios";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";

const RecommendedCampaigns = ({ currentCampaignId }) => {
  const axiosSecure = useAxiosSecure();

  const {
    data: campaigns,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recommendedCampaigns", currentCampaignId],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(
          `/recommended-campaigns?excludeId=${currentCampaignId}`
        );

        return res.data;
      } catch (err) {
        console.error("❌ Error fetching recommended campaigns:", err);
        throw new Error("Failed to fetch recommended campaigns");
      }
    },
    staleTime: 5 * 60 * 1000, // Optional: cache for 5 minutes
  });

  if (isLoading) return <CardSkeleton cards={3} />;
  if (error || !campaigns) return null;
  if (campaigns.length === 0)
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-6">
        No recommended donation campaigns found.
      </div>
    );

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        More Donation Campaigns
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {campaigns.map(
          ({
            _id,
            imageUrl,
            petName,
            maxDonationAmount,
            currentDonationAmount,
            shortDescription,
          }) => {
            const progress =
              maxDonationAmount > 0
                ? Math.min(
                    (currentDonationAmount / maxDonationAmount) * 100,
                    100
                  )
                : 0;

            return (
              <div
                key={_id}
                className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden"
              >
                <div className="h-56 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={petName}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.src = "/placeholder-pet.jpg";
                    }}
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                    {petName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {shortDescription}
                  </p>

                  <div className="mb-3">
                    <div className="h-3 bg-gray-300 dark:bg-slate-700 rounded-full">
                      <div
                        className="h-3 bg-green-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span>${currentDonationAmount} raised</span>
                      <span>Goal: ${maxDonationAmount}</span>
                    </div>
                  </div>

                  <Link to={`/donation-campaigns/${_id}`}>
                    <Button className="w-full mt-2 gap-2 bg-teal-600 dark:bg-teal-600 dark:text-gray-200">
                      <FaDonate />
                      view details
                    </Button>
                  </Link>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default RecommendedCampaigns;
