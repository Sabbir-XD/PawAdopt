import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import PetCard from "./PetCard";
import { FaPaw, FaSearch, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const PetByCategory = () => {
  const { name } = useParams();
  const axiosSecure = useAxiosSecure();
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const { data: pets = [], isLoading } = useQuery({
    queryKey: ["petsByCategory", name],
    queryFn: async () => {
      const res = await axiosSecure.get(`/pets/all?category=${name}`);
      return res.data.pets;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <FaPaw className="text-4xl text-teal-600 dark:text-teal-400" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Loading {name} pets...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-12 text-center relative px-2"
        >
          {!isMobile && (
            <>
              <div className="absolute -top-6 -left-6 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-teal-100 dark:bg-teal-900/50 opacity-50"></div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-amber-100 dark:bg-amber-900/50 opacity-50"></div>
            </>
          )}
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 relative z-10">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400">
              {name.charAt(0).toUpperCase() + name.slice(1)} Friends
            </span>
          </h2>
          
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto relative z-10">
            Meet our adorable {name} companions looking for their forever homes
          </p>
        </motion.div>

        {/* Pet Grid */}
        {pets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 text-center max-w-md mx-auto"
          >
            <FaSearch className="text-4xl sm:text-5xl text-gray-400 dark:text-gray-500 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">
              No {name} pets available
            </h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              Currently there are no {name} pets in our shelter. Check back later!
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pets.map((pet) => (
              <motion.div
                key={pet._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: isMobile ? 0 : -5 }}
                className="w-full"
              >
                <PetCard pet={pet} isMobile={isMobile} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer Counter */}
        {pets.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 sm:mt-12 md:mt-16 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-md">
              <FaPaw className="text-teal-600 dark:text-teal-400" />
              <span className="font-medium text-sm sm:text-base text-gray-700 dark:text-gray-200">
                {pets.length} {name} {pets.length === 1 ? 'pet' : 'pets'} available
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PetByCategory;