import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../App.tsx";

function useFetchIds<ID>(
  resource: "places" | "maps" | "users",
  searchQuery: string,
) {
  const { data, isLoading, error } = useQuery<ID[], Error>({
    queryKey: [resource, "ids", searchQuery],
    queryFn: async () => {
      const url = new URL(`${BASE_URL}/${resource}/get/ids`);
      if (searchQuery && searchQuery.trim() !== "") {
        url.searchParams.append("search", searchQuery);
      }
      const response = await fetch(url.toString());
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch IDs");
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, error };
}

export default useFetchIds;
