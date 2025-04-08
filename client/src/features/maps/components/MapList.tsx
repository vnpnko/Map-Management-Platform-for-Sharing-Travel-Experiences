import { Flex, Text } from "@chakra-ui/react";
import MapItem from "./MapItem.tsx";

interface MapListProps {
  maps: number[];
}

const MapList: React.FC<MapListProps> = ({ maps }) => {
  if (maps.length === 0) {
    return <Text color={"green"}>no saved maps</Text>;
  } else {
    return (
      <Flex direction={"column"} gap={2}>
        {maps.map((map_id) => (
          <MapItem key={map_id} map_id={map_id} />
        ))}
      </Flex>
    );
  }
};

export default MapList;
