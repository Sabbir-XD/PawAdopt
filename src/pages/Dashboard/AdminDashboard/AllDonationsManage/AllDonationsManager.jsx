import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { FaEdit, FaPause, FaPlay, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { TableRowSkeleton } from "@/components/Loading/Loading";

const columnHelper = createColumnHelper();

const AllDonationsManage = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    data: campaigns = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminCampaigns"],
    queryFn: async () => {
      const res = await axiosSecure.get("/donations-campaigns");
      return res.data.campaigns;
    },
  });

  const handlePauseToggle = async (id, newStatus) => {
    try {
      const res = await axiosSecure.patch(`/donations-campaigns/${id}/pause`, {
        paused: newStatus,
      });

      if (res.data.modifiedCount > 0) {
        toast.success(
          `Campaign ${newStatus ? "paused" : "unpaused"} successfully`
        );
        refetch();
      }
    } catch (err) {
      toast.error("Failed to update pause status");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This campaign will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/donations-campaigns/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire("Deleted!", "Campaign has been deleted.", "success");
          refetch();
        }
      } catch (err) {
        Swal.fire("Error!", "Failed to delete campaign.", "error");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/edit-donation/${id}`);
  };

  const columns = [
    columnHelper.accessor("petName", {
      header: "Pet Name",
      cell: (info) => (
        <span className="font-medium text-xs sm:text-sm">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("imageUrl", {
      header: "Image",
      cell: (info) => (
        <img
          src={info.getValue()}
          alt="pet"
          className="h-8 w-8 sm:h-10 sm:w-10 rounded object-cover border border-gray-200 dark:border-gray-700"
        />
      ),
    }),
    columnHelper.accessor("maxDonationAmount", {
      header: "Max Amount",
      cell: (info) => (
        <span className="text-xs sm:text-sm">${info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("paused", {
      header: "Status",
      cell: (info) => (
        <span
          className={`text-xs sm:text-sm px-2 py-1 rounded-full ${
            info.getValue()
              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
          }`}
        >
          {info.getValue() ? "Paused" : "Active"}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const campaign = row.original;
        return (
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              size="icon"
              onClick={() => handleEdit(campaign._id)}
              className="h-8 w-8 sm:h-9 sm:w-9"
              title="Edit"
            >
              <FaEdit className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              size="icon"
              variant={campaign.paused ? "secondary" : "destructive"}
              onClick={() => handlePauseToggle(campaign._id, !campaign.paused)}
              className="h-8 w-8 sm:h-9 sm:w-9"
              title={campaign.paused ? "Unpause" : "Pause"}
            >
              {campaign.paused ? (
                <FaPlay className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <FaPause className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => handleDelete(campaign._id)}
              className="h-8 w-8 sm:h-9 sm:w-9"
              title="Delete"
            >
              <FaTrash className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: campaigns,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-3 sm:p-4 max-w-6xl mx-auto">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 dark:text-teal-500">
        Manage All Donation Campaigns
      </h2>

      {isLoading && <TableRowSkeleton count={5} columns={columns.length} />}

      {isError && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-4 rounded-lg border border-red-200 dark:border-red-800">
          Failed to load campaigns: {error.message}
        </div>
      )}

      {!isLoading && !isError && campaigns.length === 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
          <svg
            className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500"
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
            There are currently no donation campaigns to manage.
          </p>
        </div>
      )}

      {!isLoading && !isError && campaigns.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 uppercase"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllDonationsManage;