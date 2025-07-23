import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const ManagePet = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch pets (admin only)
  const { data: pets = [], isLoading } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => {
      const res = await axiosSecure.get("/pets");
      return res.data;
    },
  });

  // Delete pet mutation
  const deletePetMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/pets/${id}`),
    onSuccess: () => {
      toast.success("Pet deleted successfully");
      queryClient.invalidateQueries(["pets"]);
    },
    onError: () => toast.error("Failed to delete pet"),
  });

  // Update pet mutation
  const updatePetMutation = useMutation({
    mutationFn: ({ id, updatedData }) =>
      axiosSecure.patch(`/pets/${id}`, updatedData),
    onSuccess: () => {
      toast.success("Pet status updated");
      queryClient.invalidateQueries(["pets"]);
    },
    onError: () => toast.error("Failed to update pet status"),
  });

  // Toggle adopted status handler
  const toggleAdopted = (pet) => {
    updatePetMutation.mutate({
      id: pet._id,
      updatedData: { adopted: !pet.adopted },
    });
  };

  // Delete pet handler
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#14b8a6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deletePetMutation.mutate(id);
        Swal.fire("Deleted!", "Your pet has been deleted.", "success");
      }
    });
  };
  

  if (isLoading) return <div className="text-center py-8">Loading pets...</div>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-teal-600">
        Manage Pets
      </h1>
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {pets.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No pets found in the database.
                </td>
              </tr>
            )}
            {pets.map((pet, idx) => (
              <tr
                key={pet._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {idx + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {pet.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={pet?.imageUrl}
                    alt={pet.name}
                    className="h-12 w-12 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {pet.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      pet.adopted
                        ? "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {pet.adopted ? "Adopted" : "Available"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <Button
                    onClick={() => navigate(`/dashboard/update-pet/${pet?._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(pet._id)}
                    className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white"
                    size="sm"
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => toggleAdopted(pet)}
                    className={`${
                      pet.adopted
                        ? "bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                        : "bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
                    } text-white`}
                    size="sm"
                  >
                    {pet.adopted ? "Make Available" : "Mark Adopted"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePet;