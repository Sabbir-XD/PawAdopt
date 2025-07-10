import { FaPaw, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardSkeleton } from "@/components/Loading/Loading";
import UseAuth from "@/Hooks/UseAuth/UseAuth";

const PetCategory = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");
  const [autoPlay, setAutoPlay] = useState(true);
  const { loading } = UseAuth();

  const petCategories = [
    {
      id: 1,
      name: "Dogs",
      count: 142,
      description: "Loyal companions for active families",
      image:
        "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      color: "from-amber-500 to-amber-600",
    },
    {
      id: 2,
      name: "Cats",
      count: 89,
      description: "Independent yet affectionate friends",
      image:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      color: "from-gray-600 to-gray-700",
    },
    {
      id: 3,
      name: "Rabbits",
      count: 31,
      description: "Gentle and quiet companions",
      image: "https://i.ibb.co/B9r1BzZ/saira-ahmed-J8-CDf-Hy-O7-Y-unsplash.jpg",
      color: "from-pink-500 to-pink-600",
    },
    {
      id: 4,
      name: "Birds",
      count: 28,
      description: "Colorful and melodic companions",
      image:
        "https://images.unsplash.com/photo-1551085254-e96b210db58a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1580&q=80",
      color: "from-sky-500 to-sky-600",
    },
    {
      id: 5,
      name: "Fish",
      count: 45,
      description: "Beautiful aquatic pets for your home",
      image:
        "https://i.ibb.co/LdKT8Kgv/david-clode-u5-K46-Puk-KAo-unsplash.jpg",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: 6,
      name: "Small Pets",
      count: 39,
      description: "Hamsters, guinea pigs, and more",
      image: "https://i.ibb.co/4RrcSp1S/images.jpg",
      color: "from-teal-500 to-teal-600",
    },
    {
      id: 7,
      name: "Reptiles",
      count: 22,
      description: "Fascinating scaly companions",
      image:
        "https://images.unsplash.com/photo-1559253664-ca249d4608c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      id: 8,
      name: "Farm Animals",
      count: 18,
      description: "Gentle giants needing homes",
      image:
        "https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      color: "from-orange-500 to-orange-600",
    },
    {
      id: 9,
      name: "Senior Pets",
      count: 57,
      description: "Wise souls needing extra love",
      image:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: 10,
      name: "Special Needs",
      count: 34,
      description: "Resilient pets with big hearts",
      image:
        "https://images.unsplash.com/photo-1594149929911-78975a43d4f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      color: "from-rose-500 to-rose-600",
    },
    {
      id: 11,
      name: "Exotic Pets",
      count: 15,
      description: "Unique animals needing care",
      image:
        "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
      color: "from-fuchsia-500 to-fuchsia-600",
    },
    {
      id: 12,
      name: "Pocket Pets",
      count: 42,
      description: "Tiny friends with big personalities",
      image:
        "https://images.unsplash.com/photo-1537832816519-6890d6deba0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1458&q=80",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  // Auto-rotate categories
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setDirection("right");
      setCurrentIndex((prev) =>
        prev === petCategories.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, petCategories.length]);

  const nextSlide = () => {
    setDirection("right");
    setCurrentIndex((prev) =>
      prev === petCategories.length - 1 ? 0 : prev + 1
    );
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const prevSlide = () => {
    setDirection("left");
    setCurrentIndex((prev) =>
      prev === 0 ? petCategories.length - 1 : prev - 1
    );
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  // Determine visible categories (current, next, previous)
  const visibleCategories = [
    currentIndex === 0 ? petCategories.length - 1 : currentIndex - 1,
    currentIndex,
    currentIndex === petCategories.length - 1 ? 0 : currentIndex + 1,
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse Our <span className="text-teal-600">Pet Categories</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover your perfect companion from{" "}
            {petCategories.reduce((sum, category) => sum + category.count, 0)}+
            rescued animals
          </p>
        </div>

        {/* Carousel Container */}
        {loading ? (
          <CardSkeleton />
        ) : (
          <div className="relative h-[400px] md:h-[450px]">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-teal-700 p-3 rounded-full shadow-lg transition-all"
              aria-label="Previous category"
            >
              <FaArrowLeft />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-teal-700 p-3 rounded-full shadow-lg transition-all"
              aria-label="Next category"
            >
              <FaArrowRight />
            </button>

            {/* Carousel Slides */}
            <div className="relative h-full w-full overflow-hidden">
              <AnimatePresence initial={false} custom={direction}>
                {visibleCategories.map((index) => {
                  const category = petCategories[index];
                  const position =
                    index === currentIndex
                      ? "center"
                      : index ===
                        (currentIndex === 0
                          ? petCategories.length - 1
                          : currentIndex - 1)
                      ? "left"
                      : "right";

                  return (
                    <motion.div
                      key={category.id}
                      custom={direction}
                      initial={{
                        x:
                          position === "left"
                            ? "-100%"
                            : position === "right"
                            ? "100%"
                            : "0%",
                        opacity: position === "center" ? 1 : 0.7,
                        scale: position === "center" ? 1 : 0.9,
                      }}
                      animate={{
                        x:
                          position === "left"
                            ? "-25%"
                            : position === "right"
                            ? "25%"
                            : "0%",
                        opacity: position === "center" ? 1 : 0.7,
                        scale: position === "center" ? 1 : 0.9,
                        zIndex: position === "center" ? 10 : 1,
                      }}
                      exit={{
                        x: direction === "right" ? "-100%" : "100%",
                        opacity: 0,
                        scale: 0.9,
                      }}
                      transition={{ duration: 0.7 }}
                      className={`absolute top-0 ${
                        position === "center"
                          ? "left-1/2 -translate-x-1/2"
                          : position === "left"
                          ? "left-0"
                          : "right-0"
                      } w-full max-w-md`}
                    >
                      <div
                        className={`bg-gradient-to-br ${
                          category.color
                        } rounded-2xl overflow-hidden shadow-xl h-[400px] md:h-[450px] flex flex-col transition-all duration-300 ${
                          position === "center"
                            ? "cursor-default"
                            : "cursor-pointer"
                        }`}
                        onClick={() =>
                          position !== "center" && goToSlide(index)
                        }
                      >
                        <div className="relative h-2/3 overflow-hidden">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                          {position === "center" && (
                            <div className="absolute bottom-4 left-4 bg-white/90 text-teal-800 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                              <FaPaw />
                              <span>{category.count} Available</span>
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <h3
                            className={`text-2xl font-bold mb-2 ${
                              position === "center"
                                ? "text-white"
                                : "text-white/80"
                            }`}
                          >
                            {category.name}
                          </h3>
                          <p
                            className={`mb-4 ${
                              position === "center"
                                ? "text-white/90"
                                : "text-white/70"
                            }`}
                          >
                            {category.description}
                          </p>
                          {position === "center" && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="mt-auto bg-white text-teal-700 hover:bg-teal-50 font-bold px-6 py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                            >
                              <FaPaw />
                              <span>View {category.name}</span>
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {petCategories.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === index ? "bg-teal-600 w-6" : "bg-gray-300"
              }`}
              aria-label={`Go to ${petCategories[index].name} category`}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition-all flex items-center gap-2 mx-auto"
          >
            <FaPaw />
            <span>View All {petCategories.length} Categories</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default PetCategory;
