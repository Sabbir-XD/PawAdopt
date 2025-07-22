import { FaMapMarkerAlt, FaHeart, FaRegHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router";

const PetCard = ({ pet, isMobile = false }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800"
      whileHover={!isMobile ? { y: -5, shadow: "lg" } : {}}
      onHoverStart={() => !isMobile && setIsHovered(true)}
      onHoverEnd={() => !isMobile && setIsHovered(false)}
    >
      {/* Image with favorite button */}
      <div className="relative">
        <img
          src={pet.imageUrl}
          alt={pet.name}
          className="w-full h-48 sm:h-56 object-cover"
          loading="lazy"
        />
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow hover:scale-110 transition-transform"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-gray-700 dark:text-gray-300" />
          )}
        </button>

        {/* Location badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-900/90 px-3 py-1 rounded-full text-xs font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1">
          <FaMapMarkerAlt className="text-teal-500 dark:text-teal-400" />
          <span>{pet.location}</span>
        </div>
      </div>

      {/* Pet details */}
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg sm:text-xl font-bold capitalize text-gray-800 dark:text-white truncate">
            {pet.name}
          </h3>
          <span className="text-sm bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 px-2 py-1 rounded">
            {pet.age}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-3 line-clamp-2">
          {pet.shortDescription}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {pet.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* View button - only shows on hover for desktop */}
        {!isMobile && (
          <Link to={`/pet-listing/${pet?._id}`}>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              View Details
            </motion.button>
          </Link>
        )}

        {/* Always show button on mobile */}
        {isMobile && (
          <Link
            to={`/pet-listing/${pet?._id}`}
            className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            View Details
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default PetCard;
