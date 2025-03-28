import React from "react";
import { Avatar, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Status from "../components/profile/Status.tsx";
import CustomButton from "../components/ui/CustomButton.tsx";
import CustomBox from "../components/ui/CustomBox.tsx";
import PlaceForm from "../components/PlaceForm.tsx";
import PlaceList from "../components/PlaceList.tsx";

interface User {
  _id: number;
  username: string;
  name: string;
  followers: number[];
  following: number[];
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
    <CustomBox p={8}>
      <Flex direction={"column"} gap={8}>
        <Flex gap={8}>
          <Avatar
            name={user.username}
            src="" // Provide user profile pic URL if available
            size="2xl"
          />

          <Flex direction="column" gap={4}>
            <Flex gap={4}>
              <Text color="black" fontSize="2xl">
                {user.username}
              </Text>

              <CustomButton
                fontSize="md"
                color="black"
                bg="blackAlpha.300"
                _hover={{ bg: "blackAlpha.400" }}
                onClick={() => navigate(`/${user.username}/edit`)}
              >
                Edit Profile
              </CustomButton>

              <CustomButton
                fontSize="md"
                color="black"
                bg={"gray.50"}
                border="1px"
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

            <Text color="black" fontSize="lg" textAlign="left">
              {user.name}
            </Text>
          </Flex>
        </Flex>

        <Flex direction="column" gap={4}>
          <PlaceForm />

          <PlaceList user={user} />
        </Flex>
      </Flex>
    </CustomBox>
  );
};

export default MyProfilePage;
