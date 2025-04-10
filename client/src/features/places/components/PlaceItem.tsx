import React from "react";
import { Flex, Spinner, Text, useToast, Image } from "@chakra-ui/react";
import { IoIosMap, IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";
import CustomBox from "../../../components/common/CustomBox";
import IconBox from "../../../components/common/IconBox";

import useAddPlaceToUser from "../hooks/useAddPlaceToUser";
import { useUser } from "../../../context/UserContext";
import useFetchPlace from "../hooks/useFetchPlace";
import useRemovePlaceFromUser from "../hooks/useRemovePlaceFromUser";
import useAddPlaceLike from "../hooks/useAddPlaceLike";
import useRemovePlaceLike from "../hooks/useRemovePlaceLike";
import { GoogleMap, Marker } from "@react-google-maps/api";

interface PlaceItemProps {
  place_id: string;
}

const PlaceItem: React.FC<PlaceItemProps> = ({ place_id }) => {
  const toast = useToast();
  const { loggedInUser, setLoggedInUser } = useUser();
  const { place } = useFetchPlace({ place_id });
  const { addPlaceToUser, isAddingPlaceToUser } = useAddPlaceToUser();
  const { removePlace, isRemovingPlace } = useRemovePlaceFromUser();
  const { addPlaceLike } = useAddPlaceLike();
  const { removePlaceLike } = useRemovePlaceLike();

  const alreadyHasPlace =
    loggedInUser && loggedInUser.places.includes(place_id);

  if (!place) {
    return;
  }

  const center = { lat: place.location.lat, lng: place.location.lng };

  const toastError = (title: string, error: Error) => {
    toast({
      title,
      description: error.message,
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
      } catch (error) {
        toastError("Error Adding Place", error as Error);
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
        toastError("Error Removing Place", error as Error);
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
        <Flex gap={4} alignItems="center">
          {place.photoUrl && (
            <Image
              src={place.photoUrl}
              alt={`${place.name} photo`}
              borderRadius="md"
              width={"50%"}
              height={"300px"}
              objectFit="cover"
              objectPosition={"center"}
            />
          )}
          {place.location && (
            <GoogleMap
              mapContainerStyle={{
                width: "50%",
                height: "300px",
              }}
              center={center}
              zoom={10}
            >
              <Marker position={center} />
            </GoogleMap>
          )}
        </Flex>
      </Flex>
    </CustomBox>
  );
};

export default PlaceItem;
