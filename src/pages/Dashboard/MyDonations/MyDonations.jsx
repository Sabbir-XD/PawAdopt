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
  
  
  console.log(donations);

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
      <h2 className="text-2xl font-bold mb-4">My Donations</h2>

      {isLoading ? (
        <p className="text-gray-500">Loading donations...</p>
      ) : isError ? (
        <p className="text-red-500">Failed to load donations.</p>
      ) : donations.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">No donations found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-xl">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Image</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Pet Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Amount</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
              {donations.map((donation) => (
                <tr key={donation._id}>
                  <td className="px-4 py-2">
                    <img
                      src={donation.campaignImageUrl || "https://via.placeholder.com/50"}
                      alt="pet"
                      className="h-12 w-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2">{donation.campaignTitle}</td>
                  <td className="px-4 py-2 font-semibold text-green-600">
                    ${donation.amount}
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRefund(donation._id)}
                    >
                      <FaUndo className="mr-1" />
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
