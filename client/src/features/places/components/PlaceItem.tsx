import React, { useState } from "react";
import { Flex, Spinner, Text, useToast, Box, Image } from "@chakra-ui/react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { IoIosMap, IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";
import CustomBox from "../../../components/common/CustomBox";
import IconBox from "../../../components/common/IconBox";

import useAddPlaceToUser from "../hooks/useAddPlaceToUser";
import { useUser } from "../../../context/UserContext";
import useFetchPlace from "../hooks/useFetchPlace";
import useRemovePlaceFromUser from "../hooks/useRemovePlaceFromUser";
import useAddPlaceLike from "../hooks/useAddPlaceLike";
import useRemovePlaceLike from "../hooks/useRemovePlaceLike";
import CustomButton from "../../../components/common/CustomButton.tsx";

interface PlaceItemProps {
  place_id: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "200px",
};

const PlaceItem: React.FC<PlaceItemProps> = ({ place_id }) => {
  const toast = useToast();
  const { loggedInUser, setLoggedInUser } = useUser();
  const { place, isFetchingPlace: isLoading } = useFetchPlace({ place_id });
  const { addPlaceToUser, isAddingPlaceToUser } = useAddPlaceToUser();
  const { removePlace, isRemovingPlace } = useRemovePlaceFromUser();
  const { addPlaceLike } = useAddPlaceLike();
  const { removePlaceLike } = useRemovePlaceLike();

  const [showMap, setShowMap] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const alreadyHasPlace =
    loggedInUser && loggedInUser.places.includes(place_id);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (isLoading) return <Spinner color="black" />;
  if (!place) return <Text color="red.500">Place not found.</Text>;
  if (loadError)
    return <Text color="red.500">Error loading Google Maps API.</Text>;

  // Center the map on the place location if available, otherwise default to (0,0)
  const center = place.location
    ? { lat: place.location.lat, lng: place.location.lng }
    : { lat: 0, lng: 0 };

  const randomMarker = {
    lat: center.lat + 10,
    lng: center.lng + 10,
  };

  const toastError = (title: string, error: any) => {
    toast({
      title,
      description: (error as Error).message,
      status: "error",
      isClosable: true,
    });
  };

  const handleAddPlace = async () => {
    if (!loggedInUser) {
      toastError("Not Authorized", new Error("Please log in to like a place."));
      return;
    }
    if (place && loggedInUser && !alreadyHasPlace) {
      try {
        const payload = { placeId: place._id, userId: loggedInUser._id };
        const updatedUser = await addPlaceToUser(payload);
        setLoggedInUser(updatedUser);
        await addPlaceLike({ placeId: place._id, userId: loggedInUser._id });
        // Avoid directly mutating likes; ideally the hook or re-fetch updates the state.
      } catch (error) {
        toastError("Error Adding Place", error);
      }
    }
  };

  const handleRemovePlace = async () => {
    if (place && loggedInUser && alreadyHasPlace) {
      try {
        const payload = { placeId: place._id, userId: loggedInUser._id };
        const updatedUser = await removePlace(payload);
        setLoggedInUser(updatedUser);
        await removePlaceLike({ placeId: place._id, userId: loggedInUser._id });
      } catch (error) {
        toastError("Error Removing Place", error);
      }
    }
  };

  return (
    <CustomBox p={4}>
      <Flex direction="column" gap={4}>
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Text color="black" fontSize="lg" textAlign="left">
            {place.name}
          </Text>
          <Flex gap={2}>
            <IconBox color="blue.500" title="Count of likes">
              <Text
                color="black"
                fontSize="sm"
                w={10}
                h={10}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="md"
                bg="blackAlpha.200"
                borderColor="blue.600"
                borderWidth={1}
              >
                {place.likes.length}
              </Text>
            </IconBox>
            <IconBox
              title="Open in Google Maps"
              cursor="pointer"
              color="blue.500"
              borderRadius="md"
              _hover={{ bg: "blackAlpha.200" }}
              onClick={() => window.open(place.url, "_blank")}
            >
              <IoIosMap size={40} />
            </IconBox>
            {alreadyHasPlace ? (
              <IconBox
                title="Remove from saved places"
                cursor="pointer"
                color="gray.500"
                _hover={{ color: "red.600" }}
                onClick={handleRemovePlace}
              >
                {isRemovingPlace ? (
                  <Spinner size="lg" />
                ) : (
                  <IoIosRemoveCircle size={40} />
                )}
              </IconBox>
            ) : (
              <IconBox
                title="Add to saved places"
                cursor="pointer"
                color="green.500"
                _hover={{ color: "green.600" }}
                onClick={handleAddPlace}
              >
                {isAddingPlaceToUser ? (
                  <Spinner size="lg" />
                ) : (
                  <IoIosAddCircle size={40} />
                )}
              </IconBox>
            )}
          </Flex>
        </Flex>
        {/* Display place photo if available */}
        {place.photoUrl && (
          <Flex mb={4}>
            <CustomButton onClick={() => setShowImage(!showImage)}>
              {showImage ? "Hide Image" : "Show Image"}
            </CustomButton>
          </Flex>
        )}
        {showImage && place.photoUrl && (
          <Image
            src={place.photoUrl}
            alt={`${place.name} photo`}
            borderRadius="md"
            mb={4}
          />
        )}
        {/* Button to toggle the embedded map view */}
        {place.location && (
          <Flex mb={4}>
            <CustomButton onClick={() => setShowMap(!showMap)}>
              {showMap ? "Hide Map" : "Show Map"}
            </CustomButton>
          </Flex>
        )}
        {/* Render an embedded Google Map with a dot marker */}
        {showMap && place.location && isLoaded && (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={3}
          >
            <Marker position={center} />
            <Marker position={randomMarker} />
          </GoogleMap>
        )}
      </Flex>
    </CustomBox>
  );
};

export default PlaceItem;
