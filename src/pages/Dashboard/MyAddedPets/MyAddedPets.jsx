import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import UseAuth from "@/Hooks/UseAuth/UseAuth";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { Button } from "@/components/ui/button";
import { TableRowSkeleton } from "@/components/Loading/Loading";
import { FiEdit, FiTrash2, FiCheckCircle } from "react-icons/fi";

const columnHelper = createColumnHelper();

const MyAddedPets = () => {
  const { user } = UseAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const {
    data: pets = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myPets", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/pets?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/pets/${id}`);
    },
    onSuccess: () => {
      toast.success("Pet deleted successfully");
      queryClient.invalidateQueries(["myPets", user?.email]);
    },
    onError: () => toast.error("Failed to delete pet"),
  });

  const adoptMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.patch(`/pets/${id}/adopt`);
    },
    onSuccess: () => {
      toast.success("Marked as adopted");
      queryClient.invalidateQueries(["myPets", user?.email]);
    },
    onError: () => toast.error("Failed to mark as adopted"),
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#14b8a6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  const handleAdopt = (id) => {
    adoptMutation.mutate(id);
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor((row, index) => index + 1, {
        id: "sn",
        header: "#",
        cell: (info) => (
          <span className="text-xs sm:text-sm">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <span className="font-medium text-xs sm:text-sm">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("category", {
        header: "Category",
        cell: (info) => (
          <span className="text-xs sm:text-sm capitalize">
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
            className="h-8 w-8 sm:h-12 sm:w-12 rounded object-cover border dark:border-gray-600"
          />
        ),
      }),
      columnHelper.accessor("adopted", {
        header: "Status",
        cell: (info) => (
          <span
            className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
              info.getValue()
                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
            }`}
          >
            {info.getValue() ? "Adopted" : "Available"}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9"
              onClick={() =>
                navigate(`/dashboard/update-pet/${row.original._id}`)
              }
              title="Edit"
            >
              <FiEdit className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="h-8 w-8 sm:h-9 sm:w-9"
              onClick={() => handleDelete(row.original._id)}
              title="Delete"
            >
              <FiTrash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            {!row.original.adopted && (
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => handleAdopt(row.original._id)}
                title="Mark Adopted"
              >
                <FiCheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        ),
      }),
    ],
    [navigate]
  );

  const table = useReactTable({
    data: pets,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Empty state
  if (!isLoading && !isError && pets.length === 0) {
    return (
      <div className="p-4 max-w-6xl mx-auto text-center">
        <h2 className="text-lg sm:text-xl font-bold text-teal-700 dark:text-teal-300 mb-3 sm:mb-4">
          My Added Pets
        </h2>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="max-w-md mx-auto">
            <svg
              className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
              No pets found
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              You haven't added any pets yet. Get started by adding a new pet.
            </p>
            <div className="mt-4">
              <Button
                size="sm"
                onClick={() => navigate("/dashboard/add-pet")}
              >
                Add New Pet
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-teal-700 dark:text-teal-300">
          My Added Pets
        </h2>
        <Button
          size="sm"
          onClick={() => navigate("/dashboard/add-pet")}
          className="w-full sm:w-auto"
        >
          Add New Pet
        </Button>
      </div>

      {isLoading ? (
        <TableRowSkeleton columns={columns.length} />
      ) : isError ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-4 rounded-lg border border-red-200 dark:border-red-800">
          Failed to load pets. Please try again later.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              <table className="w-full text-xs sm:text-sm">
                <thead className="bg-teal-50 dark:bg-gray-800">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium text-teal-700 dark:text-teal-300 cursor-pointer hover:bg-teal-100 dark:hover:bg-gray-700 transition-colors"
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
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-teal-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-3 py-2 sm:px-4 sm:py-3 text-gray-800 dark:text-gray-200"
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

      {table.getPageCount() > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 sm:mt-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 sm:h-9 sm:w-9 p-0"
            >
              «
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 sm:h-9 sm:w-9 p-0"
            >
              ‹
            </Button>
          </div>
          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 sm:h-9 sm:w-9 p-0"
            >
              ›
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 sm:h-9 sm:w-9 p-0"
            >
              »
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAddedPets;