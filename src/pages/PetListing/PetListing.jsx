import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import PetCard from "./PetCard";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { debounce } from "lodash";
import { CardSkeleton } from "@/components/Loading/Loading";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaSearch, FaFilter } from "react-icons/fa";
import { motion } from "framer-motion";

const PetListing = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all"); // Changed from empty string to "all"
  const [ref, inView] = useInView();
  const axiosSecure = useAxiosSecure();

  // Available categories - "all" is now a valid value
  const categories = [
    { value: "all", label: "All Pets" },
    { value: "dog", label: "Dogs" },
    { value: "cat", label: "Cats" },
    { value: "bird", label: "Birds" },
    { value: "rabbit", label: "Rabbits" },
    { value: "other", label: "Other" },
  ];

  // Infinite scroll query - adjust API call to handle "all" category
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["pets", { search, category }],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axiosSecure.get(
        `/pets/all?page=${pageParam}&limit=8&search=${search}&${
          category !== "all" ? `category=${category}` : ""
        }&adopted=false`
      );
      return data;
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  // Infinite scroll trigger
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Debounced search for better UX
  useEffect(() => {
    const debounced = debounce(() => {
      refetch();
    }, 500);
    debounced();
    return () => debounced.cancel();
  }, [search, category, refetch]);

  const pets = data?.pages?.flatMap((page) => page?.pets || []) || [];

  return (
    <section className="px-4 sm:px-6 py-12 max-w-7xl mx-auto mt-10">
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Find Your <span className="text-teal-600 dark:text-teal-400">Perfect Companion</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Browse our rescued pets waiting for their forever homes
        </p>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search Input with Icon */}
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <Input
              type="text"
              placeholder="Search by name, breed, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-auto flex items-center gap-2">
            <FaFilter className="text-gray-500 dark:text-gray-400" />
            <Select
              value={category}
              onValueChange={setCategory} // Directly use the value
            >
              <SelectTrigger className="w-full md:w-[200px] rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                {categories.map((cat) => (
                  <SelectItem 
                    key={cat.value} 
                    value={cat.value}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Pets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <CardSkeleton count={8} />
        </div>
      ) : isError ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-6 rounded-xl text-center"
        >
          <p>Failed to load pets. Please try again later.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </motion.div>
      ) : pets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-xl text-center"
        >
          <FaSearch className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
            No pets found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {search || category !== "all"
              ? "Try adjusting your search filters"
              : "Check back later for new arrivals"}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
        >
          {pets.map((pet) => (
            <motion.div
              key={pet._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <PetCard pet={pet} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Infinite Scroll Loader */}
      <div ref={ref} className="h-20 flex justify-center items-center">
        {isFetchingNextPage ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-teal-600 dark:bg-teal-400 animate-bounce" />
            <div className="w-4 h-4 rounded-full bg-teal-600 dark:bg-teal-400 animate-bounce delay-100" />
            <div className="w-4 h-4 rounded-full bg-teal-600 dark:bg-teal-400 animate-bounce delay-200" />
          </div>
        ) : hasNextPage ? (
          <button
            onClick={() => fetchNextPage()}
            className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Load More Pets
          </button>
        ) : pets.length > 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            You've reached the end of our pet listings
          </p>
        ) : null}
      </div>
    </section>
  );
};

export default PetListing;