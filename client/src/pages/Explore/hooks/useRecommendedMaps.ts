import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../App";
import { Map } from "../../../models/Map";

const useRecommendedMaps = (userId?: number) => {
  const { data, isLoading, error } = useQuery<Map[], Error>({
    queryKey: ["recommendedMaps", userId],
    queryFn: async () => {
      if (!userId) throw new Error("Map ID is required for recommendations");

      const response = await fetch(`${BASE_URL}/maps/recommended/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch recommended maps");
      }

      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    recommendedMaps: data ?? [],
    isLoadingMapsRecommendations: isLoading,
    recommendationMapsError: error,
  };
};

export default useRecommendedMaps;
