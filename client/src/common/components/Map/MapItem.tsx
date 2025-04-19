import React, { useState } from "react";
import { Box, Flex, Spinner, Text, useToast } from "@chakra-ui/react";
import useAddMapToUser from "./hooks/useAddMapToUser.ts";
import useRemoveMapFromUser from "./hooks/useRemoveMapFromUser.ts";
import useAddMapLike from "./hooks/useAddMapLike.ts";
import useRemoveMapLike from "./hooks/useRemoveMapLike.ts";
import CardItem from "../CardItem.tsx";
import { GoogleMap } from "@react-google-maps/api";
import UseToastError from "../../hooks/useToastError.tsx";
import SmallPlaceItem from "../Place/SmallPlaceItem.tsx";
import useFetchPlaces from "../Place/hooks/useFetchPlaces.ts";
import CustomMarker from "./CustomMarker.tsx";
import { Map } from "../../../models/Map.ts";
import { useLoggedInUserStore } from "../../../store/useLoggedInUserStore.ts";

interface MapItemProps {
  map: Map;
}

const MapItem: React.FC<MapItemProps> = ({ map }) => {
  const toast = useToast();
  const { loggedInUser, setLoggedInUser } = useLoggedInUserStore();
  const { addMapToUser, isAddingMapToUser } = useAddMapToUser();
  const { removeMap, isRemovingMap } = useRemoveMapFromUser();
  const { addMapLike, isAddingMapLike } = useAddMapLike();
  const { removeMapLike, isRemovingMapLike } = useRemoveMapLike();

  const alreadyHasMap = loggedInUser?.maps.includes(map._id);
  const { places, isLoading } = useFetchPlaces({
    placeIds: map.places,
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAddMap = async () => {
    if (loggedInUser === null) {
      toast({
        title: "Not Authorized",
        description: "Please log in to like a map.",
        status: "error",
        isClosable: true,
      });
      return;
    }
    if (map && loggedInUser && !alreadyHasMap) {
      try {
        const payload = { mapId: map._id, userId: loggedInUser._id };
        const updatedUser = await addMapToUser(payload);
        setLoggedInUser(updatedUser);
        await addMapLike({ mapId: map._id, userId: loggedInUser._id });
        map.likes.push(loggedInUser._id);
      } catch (error) {
        toast({
          title: "UseToastError Adding Map",
          description: (error as UseToastError).message,
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  const handleRemoveMap = async () => {
    if (map && loggedInUser && alreadyHasMap) {
      try {
        const payload = { mapId: map._id, userId: loggedInUser._id };
        const updatedUser = await removeMap(payload);
        setLoggedInUser(updatedUser);
        await removeMapLike({ mapId: map._id, userId: loggedInUser._id });
        map.likes = map.likes.filter((id) => id !== loggedInUser._id);
      } catch (error) {
        toast({
          title: "UseToastError Removing Map",
          description: (error as UseToastError).message,
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <Box textAlign="center" color="black" p={4}>
        <Spinner />
      </Box>
    );
  }

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
      likedByUser={alreadyHasMap}
      onLike={handleAddMap}
      onUnlike={handleRemoveMap}
      isPending={
        isAddingMapToUser ||
        isRemovingMap ||
        isAddingMapLike ||
        isRemovingMapLike
      }
    >
      <Flex direction={"column"} gap={4}>
        <Flex>
          <GoogleMap
            mapContainerStyle={{
              width: "50%",
              height: "300px",
            }}
            onLoad={(map) => {
              map.fitBounds(bounds);
            }}

            // center={places[currentIndex].location}
          >
            {places.map((place) => (
              <CustomMarker
                key={place._id}
                position={place.location}
                isCurrent={currentIndex === places.indexOf(place)}
                onClick={() => setCurrentIndex(places.indexOf(place))}
              />
            ))}
          </GoogleMap>
          <UseToastError
            currentIndex={currentIndex}
            onIndexChange={setCurrentIndex}
            width="50%"
            height="300px"
          >
            {places.map((place) => (
              <SmallPlaceItem place={place} key={place._id} />
            ))}
          </UseToastError>
        </Flex>
        <Flex color={"black"} textAlign={"left"} gap={2}>
          <Text fontWeight={"medium"}>username</Text>
          <Text>{map.description}</Text>
        </Flex>
      </Flex>
    </CardItem>
  );
};

export default MapItem;
