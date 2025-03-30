import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../App";
import { Place } from "../models/Place";

interface GetPlacePlace {
  place_id: string;
}

const useGetPlace = (place_id: string) => {
  const { data, isLoading, error } = useQuery<Place>({
    queryKey: ["place", place_id],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/places/${place_id}`);
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

  return { place: data, isLoading, error };
};

export default useGetPlace;
