import React from "react";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import {
  IoIosMap,
  IoIosAddCircle,
  IoIosPeople,
  IoIosRemoveCircle,
} from "react-icons/io";
import CustomBox from "./ui/CustomBox";
import { usePlaceActions } from "../hooks/usePlaceActions";
import { BASE_URL } from "../App";
import IconBox from "./ui/IconBox.tsx";

export interface Place {
  _id: string;
  url: string;
  name: string;
  likes: number[];
}

interface User {
  _id: number;
  username: string;
  name: string;
  followers: number[];
  following: number[];
  places: string[];
}

interface PlaceItemProps {
  user: User;
  place: Place;
}

const PlaceItem: React.FC<PlaceItemProps> = ({ user, place }) => {
  const { isAdding, isRemoving, handleAddPlace, handleRemovePlace } =
    usePlaceActions({ baseUrl: BASE_URL });

  const alreadyHasPlace = user.places.includes(place._id.toString());

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
          onClick={() => handleRemovePlace(place)}
        >
          {isRemoving ? <Spinner size="lg" /> : <IoIosRemoveCircle size={40} />}
        </IconBox>
      ) : (
        <IconBox
          title="Add to saved places"
          cursor="pointer"
          color="green.500"
          _hover={{ color: "green.600" }}
          onClick={() => handleAddPlace(place)}
        >
          {isAdding ? <Spinner size="lg" /> : <IoIosAddCircle size={40} />}
        </IconBox>
      )}
    </Flex>
  );
};

export default PlaceItem;
