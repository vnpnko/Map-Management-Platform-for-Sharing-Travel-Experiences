import React from "react";
import { Text, Box, Spinner } from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import useInfiniteFetchPlaces from "./hooks/useInfiniteFetchPlaces";
import PlaceItem from "./PlaceItem.tsx";

export type PlaceListProps = {
  items: string[];
};

const PlaceList: React.FC<PlaceListProps> = ({ items }) => {
  const { places, fetchNextPage, hasNextPage, status, isFetchingNextPage } =
    useInfiniteFetchPlaces({ placeIds: items, pageSize: 3 });

  if (status === "pending") {
    return (
      <Box textAlign="center" color={"black"} p={4}>
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
        <Box textAlign="center" color={"black"} p={4}>
          <Spinner />
        </Box>
      }
      endMessage={
        <Box textAlign="center" color={"black"} p={4}>
          <Text>no more places</Text>
        </Box>
      }
    >
      {places.map((place, index) => (
        // <Text color={"black"} key={index} p={2} borderBottom="1px solid #ccc">
        //   {place.name}
        // </Text>
        <PlaceItem place_id={place._id} key={index} />
      ))}
      {isFetchingNextPage && (
        <Box textAlign="center" color={"black"} p={4}>
          <Spinner />
        </Box>
      )}
    </InfiniteScroll>
  );
};

export default PlaceList;
