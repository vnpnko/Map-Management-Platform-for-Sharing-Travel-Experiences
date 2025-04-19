import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import useAddMapToUser from "./hooks/useAddMapToUser.ts";
import useRemoveMapFromUser from "./hooks/useRemoveMapFromUser.ts";
import useAddMapLike from "./hooks/useAddMapLike.ts";
import useRemoveMapLike from "./hooks/useRemoveMapLike.ts";
import CardItem from "../CardItem.tsx";
import useFetchPlaces from "../Place/hooks/useFetchPlaces.ts";
import { Map } from "../../../models/Map.ts";
import { useLoggedInUserStore } from "../../../store/useLoggedInUserStore.ts";
import MapWithPlaces from "./components/MapWithPlaces.tsx";
import CustomSpinner from "../CustomSpinner.tsx";
import useToastError from "../../hooks/useToastError.tsx";

interface MapItemProps {
  map: Map;
}

const MapItem: React.FC<MapItemProps> = ({ map }) => {
  const toastError = useToastError();
  const { loggedInUser, setLoggedInUser } = useLoggedInUserStore();
  const { addMapToUser, isAddingMapToUser } = useAddMapToUser();
  const { removeMap, isRemovingMap } = useRemoveMapFromUser();
  const { addMapLike, isAddingMapLike } = useAddMapLike();
  const { removeMapLike, isRemovingMapLike } = useRemoveMapLike();

  const { places, isLoading } = useFetchPlaces({
    placeIds: map.places,
  });

  const alreadyLiked = loggedInUser?.maps.includes(map._id);

  const handleLikeMapToggle = async () => {
    if (!loggedInUser) {
      toastError({
        title: "Like Failed",
        description: "Login to like maps",
      });
      return;
    }

    const payload = {
      mapId: map._id,
      userId: loggedInUser._id,
    };

    try {
      const updatedUser = alreadyLiked
        ? await removeMap(payload)
        : await addMapToUser(payload);

      setLoggedInUser(updatedUser);

      if (alreadyLiked) {
        await removeMapLike(payload);
        map.likes = map.likes.filter((id) => id !== loggedInUser._id);
      } else {
        await addMapLike(payload);
        map.likes.push(loggedInUser._id);
      }
    } catch (error) {
      toastError({
        title: alreadyLiked ? "Unlike Failed" : "Like Failed",
        description: (error as Error).message,
      });
    }
  };

  if (isLoading) return <CustomSpinner />;

  const bounds = new window.google.maps.LatLngBounds();
  places.forEach((place) => {
    bounds.extend({
      lat: place.location.lat,
      lng: place.location.lng,
    });
  });

  console.log(places[0].location);

  return (
    <CardItem
      id={map._id}
      name={map.name}
      likesCount={map.likes.length}
      // commentsCount={place.comments.length}
      likedByUser={alreadyLiked}
      onLikeToggle={handleLikeMapToggle}
      isPending={
        isAddingMapToUser ||
        isRemovingMap ||
        isAddingMapLike ||
        isRemovingMapLike
      }
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
