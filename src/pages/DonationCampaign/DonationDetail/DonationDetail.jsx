import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import {
  FaHandHoldingHeart,
  FaMapMarkerAlt,
  FaRegClock,
  FaArrowLeft,
} from "react-icons/fa";
import { IoPauseCircle, IoPlayCircle } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format, isAfter } from "date-fns";
import { CardSkeleton } from "@/components/Loading/Loading";
import DonationModal from "@/components/DonationModal/DonationModal";
import { Progress } from "@/components/ui/progress";
import RecommendedCampaigns from "@/components/RecommendedCampaigns/RecommendedCampaigns";
import UseAuth from "@/Hooks/UseAuth/UseAuth";

const DonationDetails = () => {
  const { id } = useParams();
  const { user } = UseAuth();
  const axiosSecure = useAxiosSecure();
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: campaign,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["donationCampaign", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donations-campaigns/${id}`);
      return res.data;
    },
  });

  if (isLoading)
    return <CardSkeleton count={1} className="max-w-5xl mx-auto" />;

  if (error || !campaign) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20">
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-6 rounded-lg inline-block max-w-md">
          <h3 className="text-xl font-semibold mb-2">
            Unable to load campaign
          </h3>
          <p>Please check the URL or try again later.</p>
          <Link
            to="/donation-campaigns"
            className="mt-4 inline-flex items-center text-teal-600 dark:text-teal-400 hover:underline"
          >
            ← Back to campaigns
          </Link>
        </div>
      </div>
    );
  }

  const currentAmount = campaign.currentDonationAmount || 0;
  const maxAmount = campaign.maxDonationAmount || 1;
  const isExpired = isAfter(new Date(), new Date(campaign.deadline));
  const isActive = !campaign.paused && !isExpired;
  const progressPercentage = Math.min((currentAmount / maxAmount) * 100, 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 mt-10">
      <div className="mb-6">
        <Link
          to="/donation-campaigns"
          className="inline-flex items-center text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to All Campaigns
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative group">
          <img
            src={campaign.imageUrl || "/placeholder-pet.jpg"}
            alt={campaign.petName || "Pet"}
            className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-xl transition-shadow group-hover:shadow-teal-200/50 dark:group-hover:shadow-teal-800/30"
            onError={(e) => (e.target.src = "/placeholder-pet.jpg")}
          />
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 px-3 py-1 rounded-full flex items-center backdrop-blur-sm">
            {!isActive ? (
              <IoPauseCircle className="h-5 w-5 text-yellow-500 mr-1" />
            ) : (
              <IoPlayCircle className="h-5 w-5 text-green-500 mr-1" />
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isExpired ? "Expired" : campaign.paused ? "Paused" : "Active"}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-teal-50">
            {campaign.petName || "Unnamed Pet"}
          </h1>

          {campaign.location && (
            <div className="flex items-center text-gray-600 dark:text-teal-100/80">
              <FaMapMarkerAlt className="mr-2 text-teal-500" />
              {campaign.location}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-700 dark:text-teal-100">
                Raised: ${currentAmount.toLocaleString()}
              </span>
              <span className="text-gray-700 dark:text-teal-100">
                Goal: ${maxAmount.toLocaleString()}
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-3 bg-gray-200 dark:bg-gray-700"
              indicatorClassName="bg-teal-500 dark:bg-teal-600"
            />
            <div className="text-right text-sm text-teal-600 dark:text-teal-400 font-medium">
              {progressPercentage.toFixed(1)}% funded
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Created
              </p>
              <p className="font-medium dark:text-teal-100">
                {format(new Date(campaign.createdAt), "MMM d, yyyy")}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Deadline
              </p>
              <p
                className={`font-medium ${
                  isExpired
                    ? "text-red-500 dark:text-red-400"
                    : "dark:text-teal-100"
                }`}
              >
                {format(new Date(campaign.deadline), "MMM d, yyyy")}
              </p>
            </div>
          </div>

          {campaign.shortDescription && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-2 dark:text-teal-100">
                Short Description
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {campaign.shortDescription}
              </p>
            </div>
          )}

          {campaign.longDescription && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-2 dark:text-teal-100">
                Full Story
              </h3>
              <div
                className="prose dark:prose-invert max-w-full"
                dangerouslySetInnerHTML={{ __html: campaign.longDescription }}
              />
            </div>
          )}

          {user?.email === campaign?.createdBy ? (
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 p-4 rounded-xl text-center">
              🐾 You can't donate to your own campaign!
            </div>
          ) : isActive ? (
            <Button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setIsOpen(true);
              }}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-5 text-lg shadow-md hover:shadow-teal-500/20"
            >
              <FaHandHoldingHeart className="mr-2 text-white" /> Donate Now
            </Button>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 p-4 rounded-xl flex items-center">
              <FaRegClock className="mr-2 text-yellow-500 dark:text-yellow-400" />
              {isExpired
                ? "This campaign has ended. Thank you for your support!"
                : "This campaign is currently paused."}
            </div>
          )}
        </div>
      </div>

      <DonationModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        campaign={campaign}
      />

      <div className="mt-20">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-teal-100 mb-8">
          Other Campaigns You Might Like
        </h2>
        <div className="">
          <RecommendedCampaigns currentCampaignId={campaign?._id} />
        </div>
      </div>
    </div>
  );
};

export default DonationDetails;
