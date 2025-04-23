import { useQueries } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { Place } from "../../../models/Place.ts";

interface FetchPlacesProps {
  placeIds: string[];
}

const useFetchPlaces = ({ placeIds }: FetchPlacesProps) => {
  const queries = useQueries({
    queries: placeIds.map((id) => ({
      queryKey: ["place", id],
      queryFn: async (): Promise<Place> => {
        const response = await fetch(`${BASE_URL}/places/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch place");
        }
        return response.json();
      },
      enabled: !!id,
      retry: false,
      refetchOnWindowFocus: false,
    })),
  });

  const places = queries
    .map((query) => query.data)
    .filter((data) => data != null) as Place[];
  const isLoading = queries.some((query) => query.isLoading);
  const error = queries.find((query) => query.error)?.error;

  return { places, isLoading, error };
};

export default useFetchPlaces;
