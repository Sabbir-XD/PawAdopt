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
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("category", {
        header: "Category",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("imageUrl", {
        header: "Image",
        cell: (info) => (
          <img
            src={info.getValue()}
            alt="pet"
            className="h-12 w-12 rounded object-cover border dark:border-gray-600"
          />
        ),
      }),
      columnHelper.accessor("adopted", {
        header: "Status",
        cell: (info) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${
              info.getValue()
                ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100"
                : "bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100"
            }`}
          >
            {info.getValue() ? "Adopted" : "Not Adopted"}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => navigate(`/dashboard/update-pet/${row.original._id}`)}
            >
              Update
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(row.original._id)}
            >
              Delete
            </Button>
            {!row.original.adopted && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAdopt(row.original._id)}
              >
                Mark Adopted
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

  // Empty state handling
  if (!isLoading && !isError && pets.length === 0) {
    return (
      <div className="p-4 max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-teal-700 dark:text-teal-300 mb-4">
          My Added Pets
        </h2>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="max-w-md mx-auto">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
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
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              No pets found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              You haven't added any pets yet. Get started by adding a new pet.
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate("/dashboard/add-pet")}>
                Add New Pet
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-teal-700 dark:text-teal-300 mb-4">
        My Added Pets
      </h2>

      {isLoading ? (
        <TableRowSkeleton columns={columns.length} />
      ) : isError ? (
        <p className="text-red-500 dark:text-red-400">Failed to load pets</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <table className="min-w-full text-sm">
            <thead className="bg-teal-100 dark:bg-gray-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-4 py-3 text-left font-semibold text-teal-700 dark:text-teal-300 cursor-pointer hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors"
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
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-teal-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-gray-800 dark:text-gray-200">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {table.getPageCount() > 1 && (
        <div className="flex justify-between items-center gap-4 mt-6 text-sm">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span className="text-gray-700 dark:text-gray-300">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyAddedPets;