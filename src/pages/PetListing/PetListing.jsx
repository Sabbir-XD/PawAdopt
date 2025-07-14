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

const PetListing = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [ref, inView] = useInView();
  const axiosSecure = useAxiosSecure();

  // Infinite scroll query
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
        `/pets/all?page=${pageParam}&limit=6&search=${search}&category=${category}&adopted=false`
      );
      return data; // { pets: [], hasMore: true/false }
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
    <section className="px-4 py-10 max-w-7xl mx-auto">
      {/* Filters */}
      <div className="mt-10 mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search Input using shadcn/ui */}
        <Input
          type="text"
          placeholder="Search pets by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md"
        />

        {/* Category Dropdown using shadcn/ui */}
        <Select
          value={category}
          onValueChange={(val) => setCategory(val === "all" ? "" : val)}
        >
          <SelectTrigger className="w-full rounded-md">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="dog">Dog</SelectItem>
            <SelectItem value="cat">Cat</SelectItem>
            <SelectItem value="bird">Bird</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pets Grid */}
      {isLoading ? (
        <CardSkeleton count={6} />
      ) : isError ? (
        <p className="text-center text-red-500">Failed to load pets.</p>
      ) : pets.length === 0 ? (
        <p className="text-center">No pets found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <PetCard key={pet?._id} pet={pet} />
          ))}
        </div>
      )}

      {/* Infinite Scroll Loader */}
      <div ref={ref} className="h-12 flex justify-center items-center mt-8">
        {isFetchingNextPage && <span className="loading loading-spinner" />}
      </div>
    </section>
  );
};

export default PetListing;
