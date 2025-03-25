import React from "react";
import { Avatar, Flex, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Status from "../components/profile/Status.tsx";
import CustomButton from "../components/ui/CustomButton.tsx";

interface User {
  _id: string;
  username: string;
  name: string;
  followers: string[];
  following: string[];
  places: string[];
}

interface MyProfilePageProps {
  user: User;
}

const MyProfilePage: React.FC<MyProfilePageProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Flex alignItems="center" mb={6}>
      <Avatar
        name={user.username}
        src="" // put user profile pic URL here if available
        size="2xl"
        mr={8}
      />
      <VStack direction="column" gap={4}>
        <Flex gap={4}>
          <Text color="black" fontSize="2xl">
            {user.username}
          </Text>
          <CustomButton
            fontSize="md"
            color={"black"}
            bg={"blackAlpha.300"}
            _hover={{ bg: "blackAlpha.400" }}
            onClick={() => {
              navigate(`/${user.username}/edit`);
            }}
          >
            Edit Profile
          </CustomButton>
          <CustomButton
            fontSize="md"
            color={"black"}
            bg={"red.300"}
            _hover={{ bg: "red.400" }}
            onClick={handleLogout}
          >
            Logout
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
      </VStack>
    </Flex>
  );
};

export default MyProfilePage;
