import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import PlaceItem from "./PlaceItem.tsx";

interface PlaceListProps {
  items: string[];
}

const PlaceList: React.FC<PlaceListProps> = ({ items }) => {
  if (items.length === 0) {
    return <Text color={"green"}>no saved places</Text>;
  } else {
    return (
      <Flex direction={"column"} gap={2}>
        {items.map((id) => (
          <PlaceItem key={id} place_id={id} />
        ))}
      </Flex>
    );
  }
};

export default PlaceList;
