import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import MapItem from "./MapItem";

interface MapListProps {
  items: number[];
}

const MapList: React.FC<MapListProps> = ({ items }) => {
  if (items.length === 0) {
    return <Text color={"green"}>no saved maps</Text>;
  } else {
    return (
      <Flex direction={"column"} gap={2}>
        {items.map((id) => (
          <MapItem key={id} map_id={id} />
        ))}
      </Flex>
    );
  }
};

export default MapList;
