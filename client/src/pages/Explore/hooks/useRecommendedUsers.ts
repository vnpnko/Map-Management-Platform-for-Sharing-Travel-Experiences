import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../App";
import { User } from "../../../models/User";

const useRecommendedUsers = (userId?: number) => {
  const { data, isLoading, error } = useQuery<User[], Error>({
    queryKey: ["recommendedUsers", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required for recommendations");

      const response = await fetch(`${BASE_URL}/users/recommended/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch recommended users");
      }

      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    recommendedUsers: data ?? [],
    isLoadingUsersRecommendations: isLoading,
    recommendationUsersError: error,
  };
};

export default useRecommendedUsers;
