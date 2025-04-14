import { useInfiniteQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../../App.tsx";
import { Place } from "../../../../models/Place.ts";

interface UseInfiniteFetchPlacesProps {
  placeIds: string[];
  pageSize?: number;
}

interface PlacesPage {
  places: Place[];
  nextPage?: number;
}

const useInfiniteFetchPlaces = ({
  placeIds,
  pageSize = 10,
}: UseInfiniteFetchPlacesProps) => {
  // Function to fetch a page of places.
  const fetchPlacesPage = async ({ pageParam = 0 }): Promise<PlacesPage> => {
    // Calculate the slice (start-end) from the array of place IDs.
    const start = pageParam * pageSize;
    const end = start + pageSize;
    const selectedPlaceIds = placeIds.slice(start, end);

    // Fetch each place from the API.
    const places: Place[] = await Promise.all(
      selectedPlaceIds.map(async (id) => {
        const response = await fetch(`${BASE_URL}/places/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch place");
        }
        return response.json();
      }),
    );

    // Determine the next page if there are still places left to fetch.
    const nextPage = end < placeIds.length ? pageParam + 1 : undefined;
    return { places, nextPage };
  };

  // Use useInfiniteQuery to manage paging.
  const queryResult = useInfiniteQuery({
    queryKey: ["placesInfinite", placeIds],
    queryFn: fetchPlacesPage,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  // Flatten the pages' places into one array.
  const places = queryResult.data?.pages.flatMap((page) => page.places) || [];

  return { ...queryResult, places };
};

export default useInfiniteFetchPlaces;
