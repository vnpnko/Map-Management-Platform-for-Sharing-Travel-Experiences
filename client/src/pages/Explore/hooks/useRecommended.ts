import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../App";

const useRecommended = <T>(
  resource: "users" | "places" | "maps",
  userId?: number,
) => {
  const { data, isLoading, error } = useQuery<T[], Error>({
    queryKey: [`recommended-${resource}`, userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

      const response = await fetch(
        `${BASE_URL}/${resource}/recommended/${userId}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Failed to fetch recommended ${resource}`,
        );
      }

      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
  return {
    recommendations: data ?? [],
    isLoadingRecommendations: isLoading,
    recommendationsError: error,
  };
};

export default useRecommended;
