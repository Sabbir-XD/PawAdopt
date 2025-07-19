import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { FaDonate } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { CardSkeleton } from "../Loading/Loading";

const RecommendedCampaigns = ({ currentCampaignId }) => {
  const axiosSecure = useAxiosSecure();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["recommendedCampaigns"],
    queryFn: async () => {
      const res = await axiosSecure.get("/donations-campaigns/recommended");
      return res.data.filter((c) => c._id !== currentCampaignId);
    },
  });

  if (isLoading) return <CardSkeleton cards={2} />;

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-6">
        No recommended donation campaigns found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
      {campaigns.map((campaign) => {
        const {
          _id,
          petImage,
          petName,
          maxDonationAmount,
          currentDonationAmount,
          shortDescription,
        } = campaign;

        const progress =
          maxDonationAmount > 0
            ? Math.min((currentDonationAmount / maxDonationAmount) * 100, 100)
            : 0;

        return (
          <div
            key={_id}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden"
          >
            <div className="h-56 overflow-hidden">
              <img
                src={petImage}
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
                <Button className="w-full mt-2 gap-2">
                  <FaDonate />
                  Support Now
                </Button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecommendedCampaigns;
