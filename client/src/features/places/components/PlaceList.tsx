import { Flex, Text } from "@chakra-ui/react";
import PlaceItem from "./PlaceItem.tsx";
import React from "react";

interface PlaceListProps {
  places: string[];
}

const PlaceList: React.FC<PlaceListProps> = ({ places }) => {
  if (places.length === 0) {
    return <Text color={"green"}>no saved places</Text>;
  } else {
    return (
      <Flex direction={"column"} gap={2}>
        {places.map((place_id) => (
          <PlaceItem key={place_id} place_id={place_id} />
        ))}
      </Flex>
    );
  }
};

export default PlaceList;
