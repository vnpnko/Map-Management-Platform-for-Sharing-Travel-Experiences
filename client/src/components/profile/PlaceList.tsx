import { Flex, Text } from "@chakra-ui/react";
import PlaceItem from "./PlaceItem.tsx";
import { User } from "../../models/User.ts";
import ToggleButton from "../ui/ToggleButton.tsx";

interface PlaceListProps {
  user: User;
}

const PlaceList: React.FC<PlaceListProps> = ({ user }) => {
  if (user.places.length === 0) {
    return <Text color={"green"}>you have no saved places yet</Text>;
  } else {
    return (
      <Flex direction={"column"} gap={4}>
        <Flex justifyContent={"space-between"} gap={4}>
          <ToggleButton label={"places"} isSelected={true} onClick={() => {}} />
          <ToggleButton label={"maps"} isSelected={false} onClick={() => {}} />
        </Flex>
        <Flex direction={"column"} gap={2}>
          {user.places.map((place_id) => (
            <PlaceItem key={place_id} place_id={place_id} />
          ))}
        </Flex>
      </Flex>
    );
  }
};

export default PlaceList;
