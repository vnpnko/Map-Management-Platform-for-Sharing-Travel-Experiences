import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../App";
import { User } from "../models/User";

const useGetUser = (username: string) => {
  const { data, isLoading, error } = useQuery<User>({
    queryKey: ["user", username],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/users/username/${username}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch user");
      }
      return response.json();
    },
    enabled: !!username,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { user: data, isLoading, error };
};

export default useGetUser;
