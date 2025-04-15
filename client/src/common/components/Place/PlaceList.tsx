import React from "react";
import { Text, Box, Spinner } from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Place } from "../../../models/Place";
import useInfiniteFetchItems from "../../hooks/useInfiniteFetchItems";
import PlaceItem from "./PlaceItem";

export type PlaceListProps = {
  items: string[];
};

const PlaceList: React.FC<PlaceListProps> = ({ items }) => {
  const {
    items: places,
    fetchNextPage,
    hasNextPage,
    status,
    isFetchingNextPage,
  } = useInfiniteFetchItems<Place, string>({
    itemIds: items,
    pageSize: 3,
    endpoint: "places",
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
        <Text color="red.500">Error loading places.</Text>
      </Box>
    );
  }

  return (
    <InfiniteScroll
      dataLength={places.length}
      next={() => fetchNextPage()}
      hasMore={hasNextPage}
      loader={
        <Box textAlign="center" color="black" p={4}>
          <Spinner />
        </Box>
      }
      endMessage={
        <Box textAlign="center" color="black" p={4}>
          <Text>No more places.</Text>
        </Box>
      }
    >
      {places.map((place, index) => (
        <PlaceItem key={index} place={place} />
      ))}

      {isFetchingNextPage && (
        <Box textAlign="center" color="black" p={4}>
          <Spinner />
        </Box>
      )}
    </InfiniteScroll>
  );
};

export default PlaceList;
