import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Search, Filter, Heart, Eye, Cake, MapPin, Loader2 } from "lucide-react";
import { Combobox, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useAxiosSecure from "@/Hooks/useAxiosSecure/useAxiosSecure";
import { CardSkeleton } from "@/components/Loading/Loading";

const petCategories = [
  { value: "dog", label: "Dog", icon: "🐕" },
  { value: "cat", label: "Cat", icon: "🐈" },
  { value: "bird", label: "Bird", icon: "🦜" },
  { value: "fish", label: "Fish", icon: "🐠" },
  { value: "rabbit", label: "Rabbit", icon: "🐇" },
  { value: "hamster", label: "Hamster", icon: "🐹" },
  { value: "reptile", label: "Reptile", icon: "🦎" },
  { value: "other", label: "Other", icon: "🐾" },
];

const PetListing = () => {
/**
 * Component for displaying a list of pets with search and filter functionalities.
 * - Utilizes infinite scrolling to fetch pets from the server in batches.
 * - Allows users to search for pets by name and filter by category.
 * - Displays a grid of pet cards with information such as name, age, and location.
 * - Includes an infinite scroll trigger to load more pets when the user scrolls to the bottom.
 * - Handles loading, error, and empty states with appropriate feedback to the user.
 */

/*************  ✨ Windsurf Command ⭐  *************/
/*******  e5bd6a1b-9ff7-4691-91dd-2e34d6594c88  *******/
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [query, setQuery] = useState("");
  const { ref, inView } = useInView();

  const fetchPets = async ({ pageParam = 1 }) => {
    const limit = 6;
    const response = await axiosSecure.get("/pets", {
      params: {
        page: pageParam,
        limit,
        search: searchTerm,
        category: selectedCategory?.value,
        adopted: false,
        sort: "-createdAt",
      },
    });
    return response.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["pets", searchTerm, selectedCategory],
    queryFn: fetchPets,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 6 ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const filteredCategories =
    query === ""
      ? petCategories
      : petCategories.filter((category) =>
          category.label.toLowerCase().includes(query.toLowerCase())
        );

  const pets = data?.pages.flatMap((page) => page) || [];

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading pets: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-teal-700 mb-2">
          Find Your Perfect Pet
        </h1>
        <p className="text-lg text-gray-600">
          Browse our adorable pets waiting for their forever homes
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by pet name..."
            className="pl-10 py-2 rounded-lg border-gray-300 focus:border-teal-400 focus:ring-teal-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Combobox
          as="div"
          value={selectedCategory}
          onChange={setSelectedCategory}
          className="w-full md:w-64"
        >
          <div className="relative">
            <Combobox.Button className="w-full">
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-left cursor-pointer hover:border-teal-400 transition-colors">
                <Filter className="h-5 w-5 text-gray-400" />
                <span className="truncate">
                  {selectedCategory?.label || "All Categories"}
                </span>
              </div>
            </Combobox.Button>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="relative px-2 py-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Combobox.Input
                    className="w-full border-0 bg-transparent pl-10 pr-4 py-1 text-gray-900 placeholder-gray-400 focus:ring-0"
                    placeholder="Filter categories..."
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                {filteredCategories.map((category) => (
                  <Combobox.Option
                    key={category.value}
                    value={category}
                    className={({ active }) =>
                      `flex items-center gap-2 px-4 py-2 cursor-pointer ${
                        active ? "bg-teal-100 text-teal-800" : "text-gray-900"
                      }`
                    }
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span>{category.label}</span>
                  </Combobox.Option>
                ))}
                <Combobox.Option
                  value={null}
                  className={({ active }) =>
                    `flex items-center gap-2 px-4 py-2 cursor-pointer ${
                      active ? "bg-teal-100 text-teal-800" : "text-gray-900"
                    }`
                  }
                >
                  <span className="text-lg">🐾</span>
                  <span>All Categories</span>
                </Combobox.Option>
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>

      {/* Grid */}
      {isLoading && !data ? (
        <CardSkeleton count={3} />
      ) : (
        <>
          {pets.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🐾</div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No pets found
              </h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory
                  ? "Try adjusting your search or filter"
                  : "Check back later for new pets"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <Card
                  key={pet._id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pet.imageUrl}
                      alt={pet.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-teal-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {
                        petCategories.find((c) => c.value === pet.category)
                          ?.icon
                      }{" "}
                      {pet.category}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-teal-800">
                      {pet.name}
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-2 mt-2">
                      <span className="flex items-center gap-2 text-gray-700">
                        <Cake className="h-4 w-4 text-teal-600" />
                        {pet.age} {pet.age === 1 ? "year" : "years"} old
                      </span>
                      <span className="flex items-center gap-2 text-gray-700">
                        <MapPin className="h-4 w-4 text-teal-600" />
                        {pet.location}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Infinite Scroll Loader */}
      <div ref={ref} className="h-10 flex items-center justify-center my-6">
        {isFetchingNextPage ? (
          <div className="flex items-center gap-2 text-teal-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading more pets...
          </div>
        ) : hasNextPage ? (
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            className="text-teal-600 border-teal-300"
          >
            Load More
          </Button>
        ) : pets.length > 0 ? (
          <p className="text-gray-500">You've reached the end of the list</p>
        ) : null}
      </div>
    </div>
  );
};

export default PetListing;
