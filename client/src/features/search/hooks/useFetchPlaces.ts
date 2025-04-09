import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { Place } from "../../../models/Place.ts";

const useFetchPlaces = (searchQuery: string = "") => {
  const { data, isLoading, error } = useQuery<Place[]>({
    queryKey: ["places", searchQuery],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/places?search=${encodeURIComponent(searchQuery)}`,
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch places");
      }
      return response.json();
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { places: data, isFetchingPlaces: isLoading, placesError: error };
};

export default useFetchPlaces;
