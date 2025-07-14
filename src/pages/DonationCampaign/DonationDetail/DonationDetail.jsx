import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { FaHandHoldingHeart, FaMapMarkerAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format } from "date-fns";
import { CardSkeleton } from "@/components/Loading/Loading";
// import DonationModal from "./DonationModal"; // ⚠️ We’ll create this next

const DonationDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [isOpen, setIsOpen] = useState(false);
  console.log(id);

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["donationCampaign", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donations-campaigns/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <CardSkeleton count={1} />;
  if (!campaign)
    return <div className="text-center text-red-500">Campaign not found</div>;

  return (
    <div className="max-w-5xl mx-auto mt-14 px-4 py-8">
      <div className="grid md:grid-cols-2 gap-6">
        <img
          src={campaign.imageUrl}
          alt={campaign.petName}
          className="w-full h-84 object-cover rounded-xl"
        />
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            {campaign.petName}
          </h2>
          <p className="text-sm text-gray-500">
            Created At: {format(new Date(campaign.createdAt), "PPP")}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>Max Donation:</strong> ${campaign.maxDonationAmount}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>Status:</strong>{" "}
            {campaign.paused ? (
              <span className="text-yellow-500">Paused</span>
            ) : (
              <span className="text-green-600">Active</span>
            )}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Deadline:</strong>{" "}
            {format(new Date(campaign.deadline), "PPP")}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Short Description:</strong> {campaign.shortDescription}
          </p>
          <div
            className="prose dark:prose-invert max-w-full"
            dangerouslySetInnerHTML={{ __html: campaign.longDescription }}
          />

          {/* Donate Now Button */}
          {!campaign.paused && (
            <Button onClick={() => setIsOpen(true)} className="mt-4 w-full">
              <FaHandHoldingHeart /> Donate Now
            </Button>
          )}
        </div>
      </div>

      {/* Step 2: Donation Modal */}
      {/* <DonationModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        campaign={campaign}
      /> */}

      {/* Step 3: Recommended Donations - We'll do next step */}
    </div>
  );
};

export default DonationDetails;
