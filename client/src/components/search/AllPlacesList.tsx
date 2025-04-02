import React from "react";
import { Flex, Text, Spinner } from "@chakra-ui/react";
import PlaceItem from "../profile/PlaceItem.tsx";
import useFetchPlaces from "../../hooks/useFetchPlaces";

const AllPlacesList: React.FC = () => {
  const { places, isFetchingPlaces, placesError } = useFetchPlaces();

  if (isFetchingPlaces) {
    return (
      <Flex align="center" justify="center" minH="200px">
        <Spinner size="lg" />
      </Flex>
    );
  }

  if (placesError) {
    return (
      <Flex align="center" justify="center" minH="200px">
        <Text color="red.500">Failed to load places</Text>
      </Flex>
    );
  }

  if (!places || places.length === 0) {
    return <Text color="green">No places available</Text>;
  }

  return (
    <Flex direction="column" gap={2}>
      {places.map((place) => (
        <PlaceItem key={place._id} place_id={place._id} />
      ))}
    </Flex>
  );
};

export default AllPlacesList;
