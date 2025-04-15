import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../App.tsx";

export interface AllIdsResponse<ID> {
  ids: ID[];
}

function useFetchAllIds<ID>(resource: "places" | "maps" | "users") {
  return useQuery<AllIdsResponse<ID>, Error>({
    queryKey: [resource, "ids"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/${resource}/ids`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch IDs");
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
  });
}

export default useFetchAllIds;
