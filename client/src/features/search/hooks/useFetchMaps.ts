import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { Map } from "../../../models/Map.ts";

const useFetchMaps = () => {
  const { data, isLoading, error } = useQuery<Map[]>({
    queryKey: ["maps"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/maps`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch maps");
      }
      return response.json();
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { maps: data, isFetchingMaps: isLoading, mapsError: error };
};

export default useFetchMaps;
