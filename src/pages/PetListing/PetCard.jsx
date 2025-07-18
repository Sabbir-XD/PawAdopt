import { Link } from "react-router";
import { FaPaw, FaHeart, FaRegHeart, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";

const PetCard = ({ pet }) => {
  const { _id, name, age, location, imageUrl, category } = pet;
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Category color mapping
  const categoryColors = {
    dog: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    cat: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    bird: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    rabbit: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    default: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300"
  };

  const categoryClass = categoryColors[category?.toLowerCase()] || categoryColors.default;

  return (
    <motion.div
      className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image with overlay */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        {/* Favorite button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:scale-110 transition-transform"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <FaHeart className="text-pink-500" />
          ) : (
            <FaRegHeart className="text-gray-700 dark:text-gray-300" />
          )}
        </button>
        
        {/* Category badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${categoryClass}`}>
          {category || "Pet"}
        </div>
      </div>

      {/* Card content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
            {name}
          </h3>
          <span className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
            {age} years
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
          <FaMapMarkerAlt className="text-teal-500 dark:text-teal-400" />
          <span className="text-sm">{location}</span>
        </div>

        {/* View Details Button */}
        <motion.div
          animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0.9, y: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            to={`/pet-listing/${_id}`}
            className="block w-full bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-teal-600 dark:to-cyan-600 hover:from-teal-600 hover:to-cyan-600 dark:hover:from-teal-700 dark:hover:to-cyan-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          >
            <FaPaw className="text-white" />
            <span>View Details</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PetCard;