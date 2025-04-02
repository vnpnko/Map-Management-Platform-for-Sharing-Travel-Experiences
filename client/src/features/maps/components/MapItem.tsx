import React from "react";
import { Box, Heading, Text, VStack, HStack, Badge } from "@chakra-ui/react";
import useFetchMap from "../hooks/useFetchMap.ts";

interface MapItemProps {
  map_id: number;
}

const MapItem: React.FC<MapItemProps> = ({ map_id }) => {
  // const toast = useToast();
  // const { loggedInUser, setLoggedInUser } = useUser();
  const { map } = useFetchMap({ mapId: map_id });
  // const { addMap, isAddingMap } = useAddMapToUser();
  // const { removeMap, isRemovingMap } = useRemoveMapFromUser();
  // const { addMapLike } = useAddMapLike();
  // const { removeMapLike } = useRemoveMapLike();
  //
  // const alreadyHasPlace = loggedInUser && loggedInUser.maps.includes(map_id);

  if (!map) {
    return;
  }

  return (
    <Box borderWidth="1px" borderRadius="md" p={4}>
      <Heading size="md">{map.name}</Heading>
      <Text mt={2}>{map.description}</Text>
      <VStack mt={3} align="start">
        <Heading size="sm">Places:</Heading>
        {map.places.length === 0 ? (
          <Text>No places added</Text>
        ) : (
          <HStack spacing={2}>
            {map.places.map((place, index) => (
              <Badge key={index} colorScheme="purple">
                {place}
              </Badge>
            ))}
          </HStack>
        )}
      </VStack>
    </Box>
  );
};

export default MapItem;
