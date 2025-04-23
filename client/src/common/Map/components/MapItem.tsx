import React from "react";
import { Flex, Link, Text } from "@chakra-ui/react";
import CardItem from "../../components/CardItem.tsx";
import useFetchPlaces from "../../Place/hooks/useFetchPlaces.ts";
import { Map } from "../../../models/Map.ts";
import MapWithPlaces from "./MapWithPlaces.tsx";
import useToggleLikeMap from "../hooks/useToggleLikeMap.ts";
import { Link as RouterLink } from "react-router-dom";

interface MapItemProps {
  map: Map;
  isDetailPage?: boolean;
}

const MapItem: React.FC<MapItemProps> = ({ map, isDetailPage }) => {
  const { alreadyLiked, handleToggle, isPending } = useToggleLikeMap(map);

  const { places, isLoading } = useFetchPlaces({ placeIds: map.places });

  return (
    <CardItem
      type={"map"}
      isDetailPage={isDetailPage}
      id={map._id}
      name={map.name}
      likesCount={map.likes.length}
      likedByUser={alreadyLiked}
      onLikeToggle={handleToggle}
      isPending={isPending || isLoading}
    >
      <Flex direction={"column"} gap={4}>
        <MapWithPlaces places={places} />
        <Flex color={"black"} textAlign={"left"} gap={2}>
          <Link
            as={RouterLink}
            to={`/${map.creatorUsername}`}
            fontWeight="medium"
          >
            {map.creatorUsername}
          </Link>
          <Text>{map.description}</Text>
        </Flex>
      </Flex>
    </CardItem>
  );
};

export default MapItem;
