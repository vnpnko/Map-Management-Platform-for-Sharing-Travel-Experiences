import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../App";
import { Place } from "../../../models/Place";

const useRecommendedPlaces = (userId?: number) => {
  const { data, isLoading, error } = useQuery<Place[], Error>({
    queryKey: ["recommendedPlaces", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required for recommendations");

      const response = await fetch(`${BASE_URL}/places/recommended/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch recommended places");
      }

      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    recommendedPlaces: data ?? [],
    isLoadingPlacesRecommendations: isLoading,
    recommendationPlacesError: error,
  };
};

export default useRecommendedPlaces;
