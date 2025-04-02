import { Flex, Text } from "@chakra-ui/react";
import PlaceItem from "./PlaceItem.tsx";
import { User } from "../../models/User.ts";

interface PlaceListProps {
  user: User;
}

const PlaceList: React.FC<PlaceListProps> = ({ user }) => {
  if (user.places.length === 0) {
    return <Text color={"green"}>you have no saved places yet</Text>;
  } else {
    return (
      <Flex direction={"column"} gap={2}>
        {user.places.map((place_id) => (
          <PlaceItem key={place_id} place_id={place_id} />
        ))}
      </Flex>
    );
  }
};

export default PlaceList;
