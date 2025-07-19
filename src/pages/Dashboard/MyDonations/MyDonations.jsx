import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { FaUndo } from "react-icons/fa";

const MyDonations = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = UseAuth();

  const {
    data: donations = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["myDonations", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/donations-payments/user?email=${user.email}`);
      return res.data;
    },
  });

  const handleRefund = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This donation will be removed. Do you want to continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, refund it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/donations-payments/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire("Refunded!", "Your donation has been refunded.", "success");
          refetch();
        } else {
          Swal.fire("Failed", "Donation not found.", "error");
        }
      } catch (err) {
        Swal.fire("Error!", "Refund failed. Try again.", "error");
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">My Donations</h2>

      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading donations...</p>
      ) : isError ? (
        <p className="text-red-500 dark:text-red-400">Failed to load donations.</p>
      ) : donations.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">No donations found.</p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 uppercase">
              <tr>
                <th className="px-6 py-4 text-left rounded-tl-2xl">Image</th>
                <th className="px-6 py-4 text-left">Pet Name</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left rounded-tr-2xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {donations.map((donation, idx) => (
                <tr
                  key={donation._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4">
                    <img
                      src={donation.campaignImageUrl || "https://via.placeholder.com/50"}
                      alt="pet"
                      className="h-12 w-12 object-cover rounded-full border border-gray-300 dark:border-gray-600"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">
                    {donation.campaignTitle}
                  </td>
                  <td className="px-6 py-4 text-green-600 dark:text-green-400 font-semibold">
                    ${donation.amount}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRefund(donation._id)}
                      className="gap-1"
                    >
                      <FaUndo />
                      Refund
                    </Button>
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

export default MyDonations;
