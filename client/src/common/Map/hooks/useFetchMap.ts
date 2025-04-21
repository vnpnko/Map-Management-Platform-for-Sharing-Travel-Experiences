import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { Map } from "../../../models/Map.ts";

interface FetchMapPayload {
  mapId: string;
}

const useFetchMap = ({ mapId }: FetchMapPayload) => {
  const { data, isLoading, error } = useQuery<Map>({
    queryKey: ["map", mapId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/maps/${mapId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch map");
      }
      return response.json();
    },
    enabled: !!mapId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { map: data, isFetchingMap: isLoading, mapError: error };
};

export default useFetchMap;
