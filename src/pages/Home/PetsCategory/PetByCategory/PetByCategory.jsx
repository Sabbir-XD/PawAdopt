import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import PetCard from "./PetCard";


const PetByCategory = () => {
  const { name } = useParams();
  const axiosSecure = useAxiosSecure();

  const { data: pets = [], isLoading } = useQuery({
    queryKey: ["petsByCategory", name],
    queryFn: async () => {
      const res = await axiosSecure.get(`/pets/all?category=${name}`);
      return res.data.pets;
    },
  });

  if (isLoading) return <p className="text-center py-10">Loading...</p>;

  return (
    <section className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 capitalize text-teal-600">
          All {name} Pets
        </h2>

        {pets.length === 0 ? (
          <p className="text-gray-500 text-center">No pets found in this category.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PetByCategory;
