import React, { useState } from "react";
import { Avatar, Flex, Text, useToast } from "@chakra-ui/react";
import CustomButton from "../components/ui/CustomButton.tsx";
import Status from "../components/profile/Status.tsx";
import { BASE_URL } from "../App.tsx";
import CustomBox from "../components/ui/CustomBox.tsx";
import PlaceList from "../components/PlaceList.tsx";

interface User {
  _id: number;
  username: string;
  name: string;
  followers: number[];
  following: number[];
  places: string[];
}

interface PublicProfilePageProps {
  user: User;
}

const PublicProfilePage: React.FC<PublicProfilePageProps> = ({ user }) => {
  const [profileUser, setProfileUser] = useState<User | null>(user);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const toast = useToast();

  const onFollow = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to follow someone.",
        status: "error",
        isClosable: true,
      });
      return;
    }
    const parsedUser = JSON.parse(storedUser) as User;
    setLoggedInUser(parsedUser);

    const payload = {
      followerId: loggedInUser!._id,
      followeeId: profileUser!._id,
    };

    try {
      const response = await fetch(`${BASE_URL}/follow`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        toast({
          title: "Failed to follow user",
          description: "Failed to follow the user.",
          status: "error",
          isClosable: true,
        });
      } else {
        if (profileUser && loggedInUser) {
          setProfileUser({
            ...profileUser,
            followers: [...profileUser.followers, loggedInUser._id],
          });
          setLoggedInUser({
            ...loggedInUser,
            following: [...loggedInUser.following, profileUser._id],
          });
          localStorage.setItem("user", JSON.stringify(loggedInUser));
        }
      }
    } catch {
      toast({
        title: "Network error",
        description: "Network error while trying to follow the user.",
        status: "error",
        isClosable: true,
      });
    }
  };

  const onUnfollow = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      return;
    }
    const parsedUser = JSON.parse(storedUser) as User;
    setLoggedInUser(parsedUser);

    const payload = {
      followerId: loggedInUser!._id,
      followeeId: profileUser!._id,
    };

    try {
      const response = await fetch(`${BASE_URL}/unfollow`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        toast({
          title: "Failed to unfollow user",
          description:
            "Something went wrong while trying to unfollow the user.",
          status: "error",
          isClosable: true,
        });
      } else {
        if (profileUser && loggedInUser) {
          const updatedProfileUser = {
            ...profileUser,
            followers: profileUser.followers.filter(
              (id) => id !== parsedUser._id,
            ),
          };
          setProfileUser(updatedProfileUser);
          const updatedLoggedInUser: User = {
            ...parsedUser,
            following: parsedUser.following.filter(
              (id) => id !== profileUser._id,
            ),
          };
          setLoggedInUser(updatedLoggedInUser);
          localStorage.setItem("user", JSON.stringify(updatedLoggedInUser));
        }
      }
    } catch {
      toast({
        title: "Network error",
        description: "Network error while trying to follow the user.",
        status: "error",
        isClosable: true,
      });
    }
  };

  if (profileUser) {
    return (
      <CustomBox p={8}>
        <Flex direction={"column"} gap={8}>
          <Flex gap={8}>
            <Avatar
              name={profileUser.username}
              src="" // Add profile image URL here if available
              size="2xl"
            />

            <Flex direction="column" gap={4}>
              <Flex gap={4}>
                <Text color="black" fontSize="2xl">
                  {profileUser.username}
                </Text>

                {loggedInUser?.following.includes(profileUser._id) ? (
                  <CustomButton
                    fontSize="md"
                    color={"black"}
                    bg={"blackAlpha.300"}
                    _hover={{ bg: "blackAlpha.400" }}
                    onClick={onUnfollow}
                  >
                    Unfollow
                  </CustomButton>
                ) : (
                  <CustomButton
                    fontSize="md"
                    color={"black"}
                    bg={"blackAlpha.300"}
                    _hover={{ bg: "blackAlpha.400" }}
                    onClick={onFollow}
                  >
                    Follow
                  </CustomButton>
                )}
              </Flex>

              <Flex gap={10}>
                <Status value={profileUser.places.length} name="places" />
                <Status value={profileUser.followers.length} name="followers" />
                <Status value={profileUser.following.length} name="following" />
              </Flex>

              <Text color="black" fontSize="lg" textAlign={"left"}>
                {profileUser.name}
              </Text>
            </Flex>
          </Flex>

          <PlaceList user={user} />
        </Flex>
      </CustomBox>
    );
  }
};

export default PublicProfilePage;
