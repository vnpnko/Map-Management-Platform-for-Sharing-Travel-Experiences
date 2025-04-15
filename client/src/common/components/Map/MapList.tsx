import React from "react";
import { Text, Box, Spinner } from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Map } from "../../../models/Map";
import useInfiniteFetchItems from "../../hooks/useInfiniteFetchItems";
import MapItem from "./MapItem";

export type MapListProps = {
  items: number[];
};

const MapList: React.FC<MapListProps> = ({ items }) => {
  const {
    items: maps,
    fetchNextPage,
    hasNextPage,
    status,
    isFetchingNextPage,
  } = useInfiniteFetchItems<Map, number>({
    itemIds: items,
    pageSize: 3,
    endpoint: "maps",
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
        <Text color="red.500">Error loading maps.</Text>
      </Box>
    );
  }

  return (
    <InfiniteScroll
      dataLength={maps.length}
      next={() => fetchNextPage()}
      hasMore={hasNextPage}
      loader={
        <Box textAlign="center" color="black" p={4}>
          <Spinner />
        </Box>
      }
      endMessage={
        <Box textAlign="center" color="black" p={4}>
          <Text>no more maps</Text>
        </Box>
      }
    >
      {maps.map((Map, index) => (
        <MapItem key={index} map={Map} />
      ))}
      {isFetchingNextPage && (
        <Box textAlign="center" color="black" p={4}>
          <Spinner />
        </Box>
      )}
    </InfiniteScroll>
  );
};

export default MapList;
