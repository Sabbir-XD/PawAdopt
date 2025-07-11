import { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import UseAuth from "@/Hooks/UseAuth/UseAuth";

const columnHelper = createColumnHelper();

const MyAddedPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const navigate = useNavigate();
  const {user} = UseAuth();

  const fetchPets = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/pets?email=${user.email}`);
      setPets(res.data);
    } catch (error) {
      toast.error("Failed to load pets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this pet?")) return;
    try {
      await axios.delete(`http://localhost:5000/pets/${id}`);
      toast.success("Pet deleted successfully");
      fetchPets();
    } catch {
      toast.error("Failed to delete pet");
    }
  };

  const handleAdopt = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/pets/${id}/adopt`, {
        adopted: true,
      });
      toast.success("Marked as adopted");
      fetchPets();
    } catch {
      toast.error("Failed to update adoption status");
    }
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
          <img src={info.getValue()} alt="pet" className="h-12 w-12 rounded object-cover" />
        ),
      }),
      columnHelper.accessor("adopted", {
        header: "Status",
        cell: (info) => (
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              info.getValue() ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"
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
          <div className="flex gap-2">
            <Button size="sm" onClick={() => navigate(`/dashboard/update-pet/${row.original._id}`)}>
              Update
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(row.original._id)}>
              Delete
            </Button>
            {!row.original.adopted && (
              <Button size="sm" variant="outline" onClick={() => handleAdopt(row.original._id)}>
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
    manualPagination: false,
  });

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-teal-700 mb-4">My Added Pets</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-full bg-white">
            <thead className="bg-teal-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-4 py-2 text-left text-sm font-semibold text-teal-700 cursor-pointer hover:bg-teal-50"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {table.getPageCount() > 1 && (
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span className="text-sm px-2 py-1">
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
