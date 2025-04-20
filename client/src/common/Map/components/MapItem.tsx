import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import CardItem from "../../components/CardItem.tsx";
import useFetchPlaces from "../../Place/hooks/useFetchPlaces.ts";
import { Map } from "../../../models/Map.ts";
import MapWithPlaces from "./MapWithPlaces.tsx";
import useToggleLikeMap from "../hooks/useToggleLikeMap.ts";

interface MapItemProps {
  map: Map;
}

const MapItem: React.FC<MapItemProps> = ({ map }) => {
  const { alreadyLiked, handleToggle, isPending } = useToggleLikeMap(map);

  const { places, isLoading } = useFetchPlaces({ placeIds: map.places });

  return (
    <CardItem
      id={map._id}
      name={map.name}
      likesCount={map.likes.length}
      // commentsCount={place.comments.length}
      likedByUser={alreadyLiked}
      onLikeToggle={handleToggle}
      isPending={isPending || isLoading}
    >
      <Flex direction={"column"} gap={4}>
        <MapWithPlaces places={places} />
        <Flex color={"black"} textAlign={"left"} gap={2}>
          <Text fontWeight={"medium"}>username</Text>
          <Text>{map.description}</Text>
        </Flex>
      </Flex>
    </CardItem>
  );
};

export default MapItem;
