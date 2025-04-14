import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../App.tsx";
import { Place } from "../../../models/Place.ts";

interface FetchPlacePayload {
  place_id: string;
}

const useFetchPlace = ({ place_id }: FetchPlacePayload) => {
  const { data, isLoading, error } = useQuery<Place>({
    queryKey: ["place", place_id],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/places/${place_id}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch place");
      }
      return response.json();
    },
    enabled: !!place_id,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { place: data, isFetchingPlace: isLoading, placeError: error };
};

export default useFetchPlace;
