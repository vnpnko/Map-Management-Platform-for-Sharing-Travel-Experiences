import React from "react";
import { Avatar, Flex, Text } from "@chakra-ui/react";
import CustomButton from "../components/ui/CustomButton.tsx";
import Status from "../components/profile/Status.tsx";

interface User {
  _id: string;
  username: string;
  name: string;
  followers: string[];
  following: string[];
  places: string[];
}

interface PublicProfilePageProps {
  user: User;
  onFollow: () => void;
}

const PublicProfilePage: React.FC<PublicProfilePageProps> = ({
  user,
  onFollow,
}) => {
  return (
    <Flex alignItems="center" mb={8}>
      <Avatar
        name={user.username}
        src="" // Add profile image URL here if available
        size="2xl"
        mr={8}
      />
      <Flex direction="column" gap={4}>
        <Flex>
          <Text color="black" fontSize="2xl" mr={4}>
            {user.username}
          </Text>
          <CustomButton
            fontSize="md"
            color={"black"}
            bg={"blackAlpha.300"}
            _hover={{ bg: "blackAlpha.400" }}
            onClick={onFollow}
          >
            Follow
          </CustomButton>
        </Flex>
        <Flex gap={10}>
          <Status value={user.places.length} name="places" />
          <Status value={user.followers.length} name="followers" />
          <Status value={user.following.length} name="following" />
        </Flex>

        <Text color="black" fontSize="lg" textAlign={"left"} w={"full"}>
          {user.name}
        </Text>
      </Flex>
    </Flex>
  );
};

export default PublicProfilePage;
