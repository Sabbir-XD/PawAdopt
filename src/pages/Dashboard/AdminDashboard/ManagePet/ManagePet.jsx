import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

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
      toast.success("Pet deleted");
      queryClient.invalidateQueries(["pets"]);
    },
    onError: () => toast.error("Failed to delete pet"),
  });

  // Update pet mutation
  const updatePetMutation = useMutation({
    mutationFn: ({ id, updatedData }) =>
      axiosSecure.patch(`/pets/${id}`, updatedData),
    onSuccess: () => {
      toast.success("Pet updated");
      queryClient.invalidateQueries(["pets"]);
    },
    onError: () => toast.error("Failed to update pet"),
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
    if (window.confirm("Are you sure you want to delete this pet?")) {
      deletePetMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading pets...</div>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Pets (Admin)</h1>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b">#</th>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Image</th>
              <th className="p-3 border-b">Category</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pets.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No pets found.
                </td>
              </tr>
            )}
            {pets.map(
              (pet, idx) => (
                console.log(pet),
                (
                  <tr
                    key={pet._id}
                    className="hover:bg-gray-50 border-b last:border-b-0"
                  >
                    <td className="p-3">{idx + 1}</td>
                    <td className="p-3 font-semibold">{pet.name}</td>
                    <td className="p-3 font-semibold">
                      <img
                        src={pet?.imageUrl}
                        alt=""
                        className="h-12 w-12 rounded object-cover"
                      />
                    </td>
                    <td className="p-3 capitalize">{pet.category}</td>
                    <td className="p-3">
                      <span
                        onClick={() => toggleAdopted(pet)}
                        className={`cursor-pointer px-3 py-1 rounded-full font-semibold select-none ${
                          pet.adopted
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                        title="Toggle Adopted Status"
                      >
                        {pet.adopted ? "Adopted" : "Available"}
                      </span>
                    </td>
                    <td className="p-3 space-x-2">
                      <Button
                        // onClick={() => openEditModal(pet)}
                        onClick={() =>
                          navigate(`/dashboard/update-pet/${pet?._id}`)
                        }
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(pet._id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePet;
