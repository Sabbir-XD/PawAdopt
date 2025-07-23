import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaPaw } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { CardSkeleton } from "@/components/Loading/Loading";

const PetCategory = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState("right");
  const [autoPlay, setAutoPlay] = useState(true);

  const { data: pets = [], isLoading } = useQuery({
    queryKey: ["allPets"],
    queryFn: async () => {
      const res = await axiosSecure.get("/pets");
      return res.data;
    },
  });

  const categoriesMap = pets.reduce((acc, pet) => {
    const key = pet.category?.toLowerCase();
    if (!acc[key]) {
      acc[key] = {
        name: key,
        image: pet.imageUrl,
        count: 1,
        description: "Discover lovable pets in this category",
        color: "from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700",
      };
    } else {
      acc[key].count += 1;
    }
    return acc;
  }, {});

  const categories = Object.values(categoriesMap);

  // Autoplay logic
  useEffect(() => {
    if (!autoPlay || categories.length === 0) return;

    const interval = setInterval(() => {
      setDirection("right");
      setIndex((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, categories.length]);

  const next = () => {
    setDirection("right");
    setIndex((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
    restartAutoPlay();
  };

  const prev = () => {
    setDirection("left");
    setIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
    restartAutoPlay();
  };

  const goToSlide = (idx) => {
    setDirection(idx > index ? "right" : "left");
    setIndex(idx);
    restartAutoPlay();
  };

  const restartAutoPlay = () => {
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 8000);
  };

  const visibleIndexes = [
    index === 0 ? categories.length - 1 : index - 1,
    index,
    index === categories.length - 1 ? 0 : index + 1,
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Browse Our{" "}
            <span className="text-teal-600 dark:text-teal-400">
              Pet Categories
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover your perfect companion from{" "}
            {categories.reduce((sum, c) => sum + c.count, 0)}+ rescued animals
          </p>
        </div>

        {isLoading || categories.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            <CardSkeleton count={3} />
          </p>
        ) : (
          <div className="relative h-[400px]">
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-teal-700 p-3 rounded-full shadow-lg dark:bg-gray-800/80 dark:hover:bg-gray-700 dark:text-teal-400"
              aria-label="Previous category"
            >
              <FaArrowLeft />
            </button>

            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-teal-700 p-3 rounded-full shadow-lg dark:bg-gray-800/80 dark:hover:bg-gray-700 dark:text-teal-400"
              aria-label="Next category"
            >
              <FaArrowRight />
            </button>

            <div className="relative h-full w-full overflow-hidden">
              <AnimatePresence initial={false} custom={direction}>
                {visibleIndexes.map((i) => {
                  const cat = categories[i];
                  const pos =
                    i === index
                      ? "center"
                      : i === (index === 0 ? categories.length - 1 : index - 1)
                      ? "left"
                      : "right";

                  return (
                    <motion.div
                      key={cat.name}
                      custom={direction}
                      initial={{
                        x:
                          pos === "left"
                            ? "-100%"
                            : pos === "right"
                            ? "100%"
                            : "0%",
                        opacity: pos === "center" ? 1 : 0.7,
                        scale: pos === "center" ? 1 : 0.9,
                      }}
                      animate={{
                        x:
                          pos === "left"
                            ? "-25%"
                            : pos === "right"
                            ? "25%"
                            : "0%",
                        opacity: pos === "center" ? 1 : 0.7,
                        scale: pos === "center" ? 1 : 0.9,
                        zIndex: pos === "center" ? 10 : 1,
                      }}
                      exit={{
                        x: direction === "right" ? "-100%" : "100%",
                        opacity: 0,
                        scale: 0.9,
                      }}
                      transition={{ duration: 0.7 }}
                      className={`absolute top-0 ${
                        pos === "center"
                          ? "left-1/2 -translate-x-1/2"
                          : pos === "left"
                          ? "left-0"
                          : "right-0"
                      } w-full max-w-md`}
                    >
                      <div
                        className={`bg-gradient-to-br ${
                          cat.color
                        } rounded-2xl overflow-hidden shadow-xl h-[400px] flex flex-col transition-all duration-300 ${
                          pos === "center" ? "cursor-default" : "cursor-pointer"
                        }`}
                        onClick={() => pos !== "center" && goToSlide(i)}
                      >
                        <div className="relative h-2/3">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-[225px] object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                          {pos === "center" && (
                            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 text-teal-800 dark:text-teal-200 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                              <FaPaw />
                              <span>{cat.count} Available</span>
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <h3
                            className={`text-2xl font-bold mb-2 ${
                              pos === "center" ? "text-white" : "text-white/80"
                            }`}
                          >
                            {cat.name.charAt(0).toUpperCase() +
                              cat.name.slice(1)}
                          </h3>
                          <p
                            className={`mb-4 ${
                              pos === "center"
                                ? "text-white/90"
                                : "text-white/70"
                            }`}
                          >
                            {cat.description || "Find your best match."}
                          </p>
                          {pos === "center" && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                navigate(
                                  `/pets/category/${categories[index].name}`
                                )
                              }
                              className="mt-auto bg-white dark:bg-gray-800 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-gray-700 font-bold px-6 py-3 rounded-lg shadow-md flex items-center justify-center gap-2"
                            >
                              <FaPaw />
                              <span>View {cat.name}</span>
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
      </div>
    </section>
  );
};

export default PetCategory;
