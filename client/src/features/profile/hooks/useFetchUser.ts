import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { User } from "../../../models/User.ts";

interface FetchUserPayload {
  username: string;
}

const useFetchUser = (payload: FetchUserPayload) => {
  const { data, isLoading, error } = useQuery<User>({
    queryKey: ["user", payload.username],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/users/username/${payload.username}`,
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch user");
      }
      return response.json();
    },
    enabled: !!payload.username,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { user: data, isFetchingUser: isLoading, userError: error };
};

export default useFetchUser;
