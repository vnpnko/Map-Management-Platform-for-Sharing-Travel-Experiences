import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../App";
import { User } from "../models/User";

const useFetchUsers = () => {
  const { data, isLoading, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/users`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch users");
      }
      return response.json();
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { users: data, isFetchingUsers: isLoading, usersError: error };
};

export default useFetchUsers;
