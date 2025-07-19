import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { FaHandHoldingHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CardSkeleton } from "@/components/Loading/Loading";
import { Link } from "react-router";

const LIMIT = 6;

const DonationCampaign = () => {
  const axiosSecure = useAxiosSecure();
  const observerRef = useRef(null);

  // Infinite Query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["donationCampaigns"],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await axiosSecure.get(
          `/donations-campaigns?page=${pageParam}&limit=${LIMIT}`
        );
        return res.data;
      },
      getNextPageParam: (lastPage) => {
        return lastPage.hasMore ? lastPage.nextPage : undefined;
      },
    });

  // Infinite Scroll Trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef?.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef?.current);
    };
  }, [fetchNextPage, hasNextPage]);

  const allCampaigns =
    data?.pages
      .flatMap((page) => page.campaigns)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) || [];

     

  return (
    <div className="max-w-7xl mx-auto mt-14 px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-teal-100">
        Donation Campaigns
      </h2>

      {isLoading ? (
        <div className="text-center">
          <CardSkeleton count={3} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCampaigns.map((campaign) => (
            <div
              key={campaign._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={campaign.imageUrl}
                alt={campaign.petName}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-teal-50">
                  {campaign.petName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Created At: {format(new Date(campaign.createdAt), "PPP")}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 dark:text-gray-300">
                    <strong>Goal:</strong> ${campaign.maxDonationAmount}
                  </p>
                  <p className="text-teal-600 dark:text-teal-400 font-medium">
                    <strong>Raised:</strong> ${campaign.donatedAmount || 0}
                  </p>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Status:</strong>{" "}
                  {campaign.paused ? (
                    <span className="text-yellow-500">Paused</span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400">Active</span>
                  )}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                  {campaign.shortDescription}
                </p>
                <Link to={`/donation-campaigns/${campaign._id}`}>
                  <Button className="mt-4 w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 text-white flex items-center justify-center gap-2 transition-colors">
                    <FaHandHoldingHeart /> View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load more spinner */}
      <div
        ref={observerRef}
        className="h-10 flex items-center justify-center mt-6"
      >
        {isFetchingNextPage && (
          <span className="text-teal-600 dark:text-teal-400">Loading more campaigns...</span>
        )}
        {!hasNextPage && !isLoading && (
          <span className="text-gray-500 dark:text-gray-400">No more campaigns to load</span>
        )}
      </div>
    </div>
  );
};

export default DonationCampaign;