import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog } from "@headlessui/react";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaPaw,
  FaHeart,
  FaArrowLeft,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { CardSkeleton } from "@/components/Loading/Loading";
import UseAuth from "@/Hooks/UseAuth/UseAuth";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const PetDetails = () => {
  const { user } = UseAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [formData, setFormData] = useState({ phone: "", address: "" });
  const axiosSecure = useAxiosSecure();
  const { id: petId } = useParams();

  const { data: pets = [], isLoading } = useQuery({
    queryKey: ["allPets"],
    queryFn: async () => {
      const res = await axiosSecure.get("/pets/all");
      return res.data.pets;
    },
  });

  if (isLoading) return <CardSkeleton count={1} />;

  const pet = pets.find((item) => item._id === petId);

  if (!pet)
    return <div className="text-center text-red-500 py-20">Pet not found</div>;

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
        toast.success("Adoption request sent successfully!");
        setIsOpen(false);
        setFormData({ phone: "", address: "" });
      } else {
        toast.error("Failed to send adoption request");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting adoption request");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
      >
        <FaArrowLeft className="text-lg" />
        <span className="font-medium">Back to Pets</span>
      </button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        {/* Left Column - Image */}
        <div className="relative h-full min-h-[400px]">
          <img
            src={pet.imageUrl}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-4 right-4 p-3 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:scale-110 transition-transform"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {isFavorite ? (
              <FaHeart className="text-pink-500 text-xl" />
            ) : (
              <FaHeart className="text-gray-400 text-xl" />
            )}
          </button>
        </div>

        {/* Right Column - Content */}
        <div className="p-6 sm:p-8 flex flex-col">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 px-4 py-2 rounded-full mb-4">
              <FaPaw className="text-teal-600 dark:text-teal-400" />
              <span className="font-medium text-teal-800 dark:text-teal-200">
                {pet.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {pet.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <span className="font-medium">{pet.age} years old</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <FaMapMarkerAlt className="text-teal-500 dark:text-teal-400" />
                <span>{pet.location}</span>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                About {pet.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-200 mb-4">
                {pet.shortDescription}
              </p>
              <div
                className="text-gray-800 dark:text-gray-200"
                dangerouslySetInnerHTML={{ __html: pet.longDescription }}
              />
            </div>
          </div>

          <div className="mt-auto">
            {user?.email === pet?.email ? (
              <div className="text-center">
                <Button
                  disabled
                  className="w-full py-6 text-lg font-semibold bg-gray-400 cursor-not-allowed dark:bg-gray-600 text-white"
                >
                  You can't adopt your own pet
                </Button>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-400 italic">
                  🐾 Be patient! Someone will give your pet a loving home.
                </p>
              </div>
            ) : (
              <Button
                onClick={() => setIsOpen(true)}
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 dark:from-teal-700 dark:to-cyan-700 dark:hover:from-teal-800 dark:hover:to-cyan-800"
              >
                Adopt {pet.name}
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Adoption Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl">
            <Dialog.Title className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
              Adopt {pet.name}
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={user?.displayName || ""}
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700">
                  <FaPhoneAlt className="text-gray-500 dark:text-gray-400 mr-3" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+1 (555) 123-4567"
                    className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Where will the pet live?"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 dark:from-teal-700 dark:to-cyan-700 dark:hover:from-teal-800 dark:hover:to-cyan-800"
                >
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
