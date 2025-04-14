import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../../App.tsx";
import { Map } from "../../../../models/Map.ts";

interface FetchMapPayload {
  mapId: number;
}

const useFetchMap = (payload: FetchMapPayload) => {
  const { data, isLoading, error } = useQuery<Map>({
    queryKey: ["map", payload.mapId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/maps/${payload.mapId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch map");
      }
      return response.json();
    },
    enabled: !!payload.mapId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { map: data, isFetchingMap: isLoading, mapError: error };
};

export default useFetchMap;
