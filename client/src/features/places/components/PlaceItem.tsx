import React from "react";
import { Flex, Spinner, Text, useToast } from "@chakra-ui/react";
import { IoIosMap, IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io";
import CustomBox from "../../../components/common/CustomBox.tsx";
import IconBox from "../../../components/common/IconBox.tsx";

import useAddPlace from "../hooks/useAddPlace.ts";
import { useUser } from "../../../context/UserContext.tsx";
import useFetchPlace from "../hooks/useFetchPlace.ts";
import useRemovePlace from "../hooks/useRemovePlace.ts";
import useAddPlaceLike from "../hooks/useAddPlaceLike.ts";
import useRemovePlaceLike from "../hooks/useRemovePlaceLike.ts";

interface PlaceItemProps {
  place_id: string;
}

const PlaceItem: React.FC<PlaceItemProps> = ({ place_id }) => {
  const toast = useToast();
  const { loggedInUser, setLoggedInUser } = useUser();
  const { place } = useFetchPlace({ place_id });
  const { addPlace, isAddingPlace } = useAddPlace();
  const { removePlace, isRemovingPlace } = useRemovePlace();
  const { addPlaceLike } = useAddPlaceLike();
  const { removePlaceLike } = useRemovePlaceLike();

  const alreadyHasPlace =
    loggedInUser && loggedInUser.places.includes(place_id);

  if (!place) {
    return;
  }

  const handleAddPlace = async () => {
    if (!loggedInUser) {
      toast({
        title: "Not Authorized",
        description: "Please log in to like a place.",
        status: "error",
        isClosable: true,
      });
      return;
    }
    if (place && loggedInUser && !alreadyHasPlace) {
      try {
        const payload = { placeId: place._id, userId: loggedInUser._id };
        const updatedUser = await addPlace(payload);
        setLoggedInUser(updatedUser);
        await addPlaceLike({ placeId: place._id, userId: loggedInUser._id });
        place.likes.push(loggedInUser._id);
      } catch (error) {
        toast({
          title: "Error Adding Place",
          description: (error as Error).message,
          status: "error",
          isClosable: true,
        });
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
        place.likes = place.likes.filter((id) => id !== loggedInUser._id);
      } catch (error) {
        toast({
          title: "Error Removing Place",
          description: (error as Error).message,
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  return (
    <Flex gap={2}>
      <CustomBox flex={1} p={2} border="1px" borderColor="blue.600">
        <Text color="black" fontSize="lg" textAlign="left">
          {place.name}
        </Text>
      </CustomBox>

      <IconBox color="blue.500" title="Count of likes">
        <Text
          color="black"
          fontSize="sm"
          w={8}
          align={"center"}
          borderColor={"blue.600"}
          borderWidth={1}
        >
          {place.likes.length}
        </Text>
      </IconBox>

      <IconBox
        title="Open in Google Maps"
        cursor="pointer"
        color="yellow.500"
        _hover={{ color: "yellow.600" }}
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
          {isAddingPlace ? <Spinner size="lg" /> : <IoIosAddCircle size={40} />}
        </IconBox>
      )}
    </Flex>
  );
};

export default PlaceItem;
