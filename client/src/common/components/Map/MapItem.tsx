import React, { useState } from "react";
import { Box, Flex, Spinner, useToast } from "@chakra-ui/react";
import useAddMapToUser from "./hooks/useAddMapToUser.ts";
import useRemoveMapFromUser from "./hooks/useRemoveMapFromUser.ts";
import useAddMapLike from "./hooks/useAddMapLike.ts";
import useRemoveMapLike from "./hooks/useRemoveMapLike.ts";
import CardItem from "../CardItem.tsx";
import { GoogleMap } from "@react-google-maps/api";
import Carousel from "../Carousel.tsx";
import SmallPlaceItem from "../Place/SmallPlaceItem.tsx";
import useFetchPlaces from "../Place/hooks/useFetchPlaces.ts";
import CustomMarker from "./CustomMarker.tsx";
import { Map } from "../../../models/Map.ts";
import { useUserStore } from "../../../store/useUserStore.ts";

interface MapItemProps {
  map: Map;
}

const MapItem: React.FC<MapItemProps> = ({ map }) => {
  const toast = useToast();
  const { user, setUser } = useUserStore();
  const { addMapToUser } = useAddMapToUser();
  const { removeMap } = useRemoveMapFromUser();
  const { addMapLike } = useAddMapLike();
  const { removeMapLike } = useRemoveMapLike();

  const alreadyHasMap = user?.maps.includes(map._id);
  const { places, isLoading } = useFetchPlaces({
    placeIds: map.places,
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleAddMap = async () => {
    if (user === null) {
      toast({
        title: "Not Authorized",
        description: "Please log in to like a map.",
        status: "error",
        isClosable: true,
      });
      return;
    }
    if (map && user && !alreadyHasMap) {
      try {
        const payload = { mapId: map._id, userId: user._id };
        const updatedUser = await addMapToUser(payload);
        setUser(updatedUser);
        await addMapLike({ mapId: map._id, userId: user._id });
        map.likes.push(user._id);
      } catch (error) {
        toast({
          title: "Error Adding Map",
          description: (error as Error).message,
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  const handleRemoveMap = async () => {
    if (map && user && alreadyHasMap) {
      try {
        const payload = { mapId: map._id, userId: user._id };
        const updatedUser = await removeMap(payload);
        setUser(updatedUser);
        await removeMapLike({ mapId: map._id, userId: user._id });
        map.likes = map.likes.filter((id) => id !== user._id);
      } catch (error) {
        toast({
          title: "Error Removing Map",
          description: (error as Error).message,
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
    >
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
        <Carousel
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
          width="50%"
          height="300px"
        >
          {places.map((place) => (
            <SmallPlaceItem place={place} key={place._id} />
          ))}
        </Carousel>
      </Flex>
    </CardItem>
  );
};

export default MapItem;
