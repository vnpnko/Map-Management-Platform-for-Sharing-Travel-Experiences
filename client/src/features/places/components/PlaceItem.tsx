import React from "react";
import { Flex, Text, useToast, Image } from "@chakra-ui/react";
import CustomBox from "../../../components/common/CustomBox";
import IconBox from "../../../components/common/IconBox";

import useAddPlaceToUser from "../hooks/useAddPlaceToUser";
import { useUser } from "../../../context/UserContext";
import useFetchPlace from "../hooks/useFetchPlace";
import useRemovePlaceFromUser from "../hooks/useRemovePlaceFromUser";
import useAddPlaceLike from "../hooks/useAddPlaceLike";
import useRemovePlaceLike from "../hooks/useRemovePlaceLike";
import { GoogleMap, Marker } from "@react-google-maps/api";
import {
  FaHeart,
  FaRegComment,
  FaRegHeart,
  FaRegMap,
  FaRegPaperPlane,
} from "react-icons/fa6";

interface PlaceItemProps {
  place_id: string;
}

const PlaceItem: React.FC<PlaceItemProps> = ({ place_id }) => {
  const toast = useToast();
  const { loggedInUser, setLoggedInUser } = useUser();
  const { place } = useFetchPlace({ place_id });
  const { addPlaceToUser } = useAddPlaceToUser();
  const { removePlace } = useRemovePlaceFromUser();
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
        <Flex justifyContent="space-between" alignItems="center">
          <Text color="black" fontSize="lg" textAlign="left">
            {place.name}
          </Text>
          <Flex gap={2}>
            <IconBox
              title="Open in Google Maps"
              cursor="pointer"
              color="black"
              borderRadius="md"
              _hover={{ color: "blackAlpha.700" }}
              onClick={() => window.open(place.url, "_blank")}
            >
              <FaRegMap size={25} />
            </IconBox>
            <IconBox
              title="Share"
              cursor="pointer"
              color="black"
              borderRadius="md"
              _hover={{ color: "blackAlpha.700" }}
              onClick={() =>
                navigator.clipboard.writeText(place.url).then(() => {
                  toast({
                    title: "Link copied to clipboard",
                    status: "success",
                    isClosable: true,
                  });
                })
              }
            >
              <FaRegPaperPlane size={25} />
            </IconBox>
            <IconBox
              title="Comment"
              color="black"
              cursor="pointer"
              borderRadius="md"
              _hover={{ color: "blackAlpha.700" }}
              onClick={() =>
                navigator.clipboard.writeText(place.url).then(() => {
                  toast({
                    title: "Redirecting to comments",
                    status: "success",
                    isClosable: true,
                  });
                })
              }
            >
              <FaRegComment size={25} />
            </IconBox>

            {alreadyHasPlace ? (
              <IconBox
                title="Unlike"
                cursor="pointer"
                color="red.500"
                onClick={handleRemovePlace}
              >
                <FaHeart size={25} />
              </IconBox>
            ) : (
              <IconBox
                title="Like"
                cursor="pointer"
                color="black"
                _hover={{ color: "blackAlpha.700" }}
                onClick={handleAddPlace}
              >
                <FaRegHeart size={25} />
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
        <Text
          color="black"
          fontSize="md"
          fontWeight={"semibold"}
          textAlign={"left"}
        >
          {place.likes.length} likes
        </Text>
        <Text
          cursor="pointer"
          color="blackAlpha.600"
          fontSize="md"
          fontWeight={"normal"}
          textAlign={"left"}
        >
          View all 229 comments
        </Text>
      </Flex>
    </CustomBox>
  );
};

export default PlaceItem;
