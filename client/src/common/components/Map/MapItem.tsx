import React, { useState } from "react";
import { Flex, useToast } from "@chakra-ui/react";
import useFetchMap from "../../hooks/Map/useFetchMap.ts";
import { useUser } from "../../../context/UserContext.tsx";
import useAddMapToUser from "../../hooks/Map/useAddMapToUser.ts";
import useRemoveMapFromUser from "../../hooks/Map/useRemoveMapFromUser.ts";
import useAddMapLike from "../../hooks/Map/useAddMapLike.ts";
import useRemoveMapLike from "../../hooks/Map/useRemoveMapLike.ts";
import CardItem from "../CardItem.tsx";
import { GoogleMap } from "@react-google-maps/api";
import Carousel from "../Carousel.tsx";
import SmallPlaceItem from "../Place/SmallPlaceItem.tsx";
import useFetchPlaces from "../../hooks/Place/useFetchPlaces.ts";
import CustomMarker from "./CustomMarker.tsx";

interface MapItemProps {
  map_id: number;
}

const MapItem: React.FC<MapItemProps> = ({ map_id }) => {
  const toast = useToast();
  const { loggedInUser, setLoggedInUser } = useUser();
  const { map } = useFetchMap({ mapId: map_id });
  const { addMapToUser } = useAddMapToUser();
  const { removeMap } = useRemoveMapFromUser();
  const { addMapLike } = useAddMapLike();
  const { removeMapLike } = useRemoveMapLike();

  const alreadyHasMap = loggedInUser && loggedInUser.maps.includes(map_id);
  const { places } = useFetchPlaces({
    placeIds: map?.places || [],
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!map) {
    return;
  }

  const handleAddMap = async () => {
    if (!loggedInUser) {
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
          title: "Error Adding Map",
          description: (error as Error).message,
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
          title: "Error Removing Map",
          description: (error as Error).message,
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  const bounds = new window.google.maps.LatLngBounds();
  places.forEach((place) => {
    bounds.extend({
      lat: place.location.lat,
      lng: place.location.lng,
    });
  });

  return (
    <CardItem
      id={map._id}
      name={map.name}
      likesCount={map.likes.length}
      // commentsCount={place.comments.length}
      likedByUser={loggedInUser?.maps.includes(map._id)}
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
          center={places[currentIndex].location}
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
