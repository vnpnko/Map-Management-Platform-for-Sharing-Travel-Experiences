import { useInfiniteQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../App.tsx";

export interface ItemsPage<T> {
  items: T[];
  nextPage?: number;
}

export interface UseInfiniteFetchItemsProps<T, ID> {
  itemIds: ID[];
  pageSize: number;
  endpoint: string;
  parseResponse?: (data: unknown) => T;
}

const useInfiniteFetchItems = <T, ID>({
  itemIds,
  pageSize,
  endpoint,
  parseResponse,
}: UseInfiniteFetchItemsProps<T, ID>) => {
  const fetchItemsPage = async ({ pageParam = 0 }): Promise<ItemsPage<T>> => {
    const start = pageParam * pageSize;
    const end = start + pageSize;
    const selectedItemIds = [...itemIds].reverse().slice(start, end);

    const items: T[] = await Promise.all(
      selectedItemIds.map(async (id) => {
        const response = await fetch(`${BASE_URL}/${endpoint}/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch ${endpoint}`);
        }
        const data = await response.json();
        return parseResponse ? parseResponse(data) : data;
      }),
    );

    const nextPage = end < itemIds.length ? pageParam + 1 : undefined;
    return { items, nextPage };
  };

  const queryResult = useInfiniteQuery({
    queryKey: [endpoint + "Infinite", itemIds],
    queryFn: fetchItemsPage,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  const items = queryResult.data?.pages.flatMap((page) => page.items) || [];

  return { ...queryResult, items };
};

export default useInfiniteFetchItems;
