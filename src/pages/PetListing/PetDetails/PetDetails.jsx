import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog } from "@headlessui/react";
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { CardSkeleton } from "@/components/Loading/Loading";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import { useParams } from "react-router";
import { toast } from "react-toastify";

const PetDetails = () => {
  const { user } = UseAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ phone: "", address: "" });
  const axiosSecure = useAxiosSecure();
  const  petId  = useParams();
  console.log(petId.id);

  const { data: pets = [], isLoading } = useQuery({
    queryKey: ["allPets"],
    queryFn: async () => {
      const res = await axiosSecure.get("/pets/all");
      return res.data.pets;
    },
  });

  if (isLoading) return <CardSkeleton count={1} />;

  const pet = pets.find((item) => item._id === petId?.id);

  if (!pet)
    return <div className="text-center text-red-500">Pet not found</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adoptionData = {
      petId: pet._id,
      petName: pet.name,
      petImage: pet.imageUrl,
      userName: user?.displayName,
      email: user?.email,
      phone: formData.phone,
      address: formData.address,
      timestamp: new Date(),
    };

    try {
      const res = await axiosSecure.post("/adoptions", adoptionData);
      if (res.status === 200 || res.status === 201) {
        toast.success("Adoption request sent!");
        setIsOpen(false);
        setFormData({ phone: "", address: "" });
      } else {
        toast.error("Failed to send adoption request");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-14 p-6 space-y-4">
      {/* Pet Info */}
      <img
        src={pet.imageUrl}
        alt={pet.name}
        className="w-full h-64 object-cover rounded-xl"
      />
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        {pet.name}
      </h2>
      <p>
        <strong>Category:</strong> {pet.category}
      </p>
      <p>
        <strong>Age:</strong> {pet.age} year(s)
      </p>
      <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
        <FaMapMarkerAlt /> {pet.location}
      </p>
      <p className="text-gray-700 dark:text-gray-300">
        <strong>Short Description:</strong> {pet.shortDescription}
      </p>
      <div
        className="prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: pet.longDescription }}
      />

      {/* Adopt Button */}
      <Button onClick={() => setIsOpen(true)} className="mt-4 w-full">
        Adopt
      </Button>

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white dark:bg-gray-900 p-6">
            <Dialog.Title className="text-xl font-semibold mb-4 text-center">
              Adopt: {pet.name}
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name (disabled) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  value={user?.displayName || ""}
                  disabled
                  className="w-full border border-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2"
                />
              </div>

              {/* Email (disabled) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full border border-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-white dark:bg-gray-800">
                  <FaPhoneAlt className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Enter your address"
                  className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-gray-800"
                />
              </div>

              {/* Submit */}
              <div className="text-center pt-4">
                <Button type="submit" className="w-full">
                  Submit Adoption Request
                </Button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default PetDetails;
