import React from "react";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import {
  IoIosMap,
  IoIosAddCircle,
  IoIosPeople,
  IoIosRemoveCircle,
} from "react-icons/io";
import CustomBox from "./ui/CustomBox";
import IconBox from "./ui/IconBox.tsx";

import useAddPlace from "../hooks/useAddPlace.ts";
import useRemovePlace from "../hooks/useRemovePlace.ts";
import { useUser } from "../context/UserContext.tsx";
import useGetPlace from "../hooks/useGetPlace.ts";

interface PlaceItemProps {
  place_id: string;
}

const PlaceItem: React.FC<PlaceItemProps> = ({ place_id }) => {
  const { addPlace, isAdding } = useAddPlace();
  const { removePlace, isRemoving } = useRemovePlace();
  const { loggedInUser } = useUser();
  const { place, isLoading, error } = useGetPlace(place_id);

  const alreadyHasPlace =
    loggedInUser && loggedInUser.places.includes(place_id);

  const handleAddPlace = async () => {
    if (place && loggedInUser && !alreadyHasPlace) {
      await addPlace(place._id, loggedInUser._id);
    }
  };

  const handleRemovePlace = async () => {
    if (place && loggedInUser && alreadyHasPlace) {
      await removePlace(place._id, loggedInUser._id);
    }
  };

  if (!place) {
    return;
  }

  return (
    <Flex gap={2}>
      <CustomBox flex={1} p={2} border="1px" borderColor="blue.600">
        <Text color="black" fontSize="lg" textAlign="left">
          {place.name}
        </Text>
      </CustomBox>

      <IconBox color="blue.500" title="Count of likes">
        <IoIosPeople size={40} />
        <Text position="absolute" mt={9} color="black" fontSize="sm">
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
          {isRemoving ? <Spinner size="lg" /> : <IoIosRemoveCircle size={40} />}
        </IconBox>
      ) : (
        <IconBox
          title="Add to saved places"
          cursor="pointer"
          color="green.500"
          _hover={{ color: "green.600" }}
          onClick={handleAddPlace}
        >
          {isAdding ? <Spinner size="lg" /> : <IoIosAddCircle size={40} />}
        </IconBox>
      )}
    </Flex>
  );
};

export default PlaceItem;
