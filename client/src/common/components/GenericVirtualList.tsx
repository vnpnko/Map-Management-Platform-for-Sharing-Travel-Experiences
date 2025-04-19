import React from "react";
import { Text, Box, Spinner } from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import useInfiniteFetchItems from "../hooks/useInfiniteFetchItems";

interface GenericVirtualListProps<T, ID> {
  items: ID[] | undefined;
  type: "users" | "places" | "maps";
  pageSize: number;
  renderItem: (item: T) => React.ReactNode;
}

function GenericVirtualList<T, ID>({
  items,
  type,
  pageSize,
  renderItem,
}: GenericVirtualListProps<T, ID>) {
  const {
    items: itemObjects,
    fetchNextPage,
    hasNextPage,
    status,
    isFetchingNextPage,
  } = useInfiniteFetchItems<T, ID>({
    itemIds: items || [],
    pageSize: pageSize,
    endpoint: type === "users" ? "users/id" : type,
  });

  if (status === "pending") {
    return (
      <Box textAlign="center" color="black" p={4}>
        <Spinner />
      </Box>
    );
  }

  if (status === "error") {
    return (
      <Box textAlign="center" p={4}>
        <Text color="red.500">Error loading items.</Text>
      </Box>
    );
  }

  return (
    <InfiniteScroll
      dataLength={itemObjects.length}
      next={() => fetchNextPage()}
      hasMore={hasNextPage}
      loader={
        <Box textAlign="center" color="black" p={4}>
          <Spinner />
        </Box>
      }
    >
      {itemObjects.length === 0 ? (
        <Box textAlign="center" p={4}>
          <Text color="black">no {type} found</Text>
        </Box>
      ) : (
        itemObjects.map(renderItem)
      )}
      {isFetchingNextPage && (
        <Box textAlign="center" color="black" p={4}>
          <Spinner />
        </Box>
      )}
    </InfiniteScroll>
  );
}

export default GenericVirtualList;
