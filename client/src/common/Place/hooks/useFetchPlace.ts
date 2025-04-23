import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { Place } from "../../../models/Place.ts";

interface FetchPlacePayload {
  placeId: string;
}

const useFetchPlace = ({ placeId }: FetchPlacePayload) => {
  const { data, isLoading, error } = useQuery<Place>({
    queryKey: ["place", placeId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/places/${placeId}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch place");
      }
      return response.json();
    },
    enabled: !!placeId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { place: data, isFetchingPlace: isLoading, placeError: error };
};

export default useFetchPlace;
