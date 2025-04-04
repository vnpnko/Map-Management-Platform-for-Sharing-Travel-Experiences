import { Flex, Text } from "@chakra-ui/react";
import MapItem from "./MapItem.tsx";
import { User } from "../../../models/User.ts";

interface MapListProps {
  user: User;
}

const MapList: React.FC<MapListProps> = ({ user }) => {
  if (user.maps.length === 0) {
    return <Text color={"green"}>you have no saved maps yet</Text>;
  } else {
    return (
      <Flex direction={"column"} gap={2}>
        {user.maps.map((map_id) => (
          <MapItem key={map_id} map_id={map_id} />
        ))}
      </Flex>
    );
  }
};

export default MapList;
