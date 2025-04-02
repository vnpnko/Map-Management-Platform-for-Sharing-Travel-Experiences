import { Flex, Text } from "@chakra-ui/react";

import PlaceItem from "./PlaceItem.tsx";
import CustomButton from "../ui/CustomButton.tsx";

import { User } from "../../models/User.ts";

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
          <CustomButton bg={"blackAlpha.600"} _hover={{ bg: "blackAlpha.600" }}>
            places
          </CustomButton>
          <CustomButton>maps</CustomButton>
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
