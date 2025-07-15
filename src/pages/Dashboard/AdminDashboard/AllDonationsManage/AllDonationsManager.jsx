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
    navigate(`/dashboard/edit-campaign/${id}`);
  };

  const columns = [
    columnHelper.accessor("petName", {
      header: "Pet Name",
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor("imageUrl", {
      header: "Image",
      cell: (info) => (
        <img
          src={info.getValue()}
          alt="pet"
          className="h-12 w-12 rounded object-cover"
        />
      ),
    }),
    columnHelper.accessor("maxDonationAmount", {
      header: "Max Amount",
      cell: (info) => `$${info.getValue()}`,
    }),
    columnHelper.accessor("paused", {
      header: "Status",
      cell: (info) =>
        info.getValue() ? (
          <span className="text-red-500">Paused</span>
        ) : (
          <span className="text-green-500">Active</span>
        ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const campaign = row.original;
        return (
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" onClick={() => handleEdit(campaign._id)}>
              <FaEdit className="mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant={campaign.paused ? "secondary" : "destructive"}
              onClick={() => handlePauseToggle(campaign._id, !campaign.paused)}
            >
              {campaign.paused ? (
                <FaPlay className="mr-1" />
              ) : (
                <FaPause className="mr-1" />
              )}
              {campaign.paused ? "Unpause" : "Pause"}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(campaign._id)}
            >
              <FaTrash className="mr-1" />
              Delete
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage All Donation Campaigns</h2>

      {isLoading && <p className="text-gray-500">Loading...</p>}

      {isError && (
        <p className="text-red-500">
          Failed to load campaigns: {error.message}
        </p>
      )}

      {!isLoading && !isError && campaigns.length === 0 && (
        <p className="text-center text-gray-600 mt-10">
          No donation campaigns found.
        </p>
      )}

      {!isLoading && !isError && campaigns.length > 0 && (
        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase"
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
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300"
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
      )}
    </div>
  );
};

export default AllDonationsManage;
