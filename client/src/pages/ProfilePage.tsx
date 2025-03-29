import React, { useState, useEffect } from "react";
import {
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  Text,
  Avatar,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../App";
import CustomButton from "../components/ui/CustomButton";
import Status from "../components/profile/Status";
import CustomBox from "../components/ui/CustomBox";
import { useUser } from "../context/UserContext";
import { User } from "../models/User";
import useLogOut from "../hooks/useLogOut.ts";
import useFollow from "../hooks/useFollow.ts";
import useUnfollow from "../hooks/useUnfollow.ts";

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>("");
  const [profileUser, setProfileUser] = useState<User | null>(null);

  const navigate = useNavigate();
  const toast = useToast();

  const { logout, error } = useLogOut();
  const { loggedInUser, setLoggedInUser } = useUser();

  const { follow } = useFollow();
  const { unfollow } = useUnfollow();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`${BASE_URL}/users/username/${username}`);
        if (!response.ok) {
          setMessage("User not found");
        } else {
          const data = await response.json();
          setProfileUser(data);
        }
      } catch {
        setMessage("Error fetching user data");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [username]);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    await logout();
    setLoggedInUser(null);
    navigate("/");
  };

  const handleFollow = async () => {
    if (loggedInUser && profileUser) {
      const payload = {
        followerId: loggedInUser?._id,
        followeeId: profileUser?._id,
      };
      const data = await follow(payload);
      if (data) {
        setProfileUser({
          ...profileUser,
          followers: [...profileUser.followers, loggedInUser._id],
        });
      }
    }
  };

  const handleUnfollow = async () => {
    if (loggedInUser && profileUser) {
      const payload = {
        followerId: loggedInUser?._id,
        followeeId: profileUser?._id,
      };
      const data = await unfollow(payload);
      if (data) {
        setProfileUser({
          ...profileUser,
          followers: profileUser.followers.filter(
            (id) => id !== loggedInUser._id,
          ),
        });
      }
    }
  };

  if (loading) {
    return (
      <Flex
        minH="100vh"
        bg="gray.50"
        direction="column"
        align="center"
        justify="center"
        gap={2}
        py={10}
      >
        <Spinner color="black" />
      </Flex>
    );
  }

  if (!profileUser) {
    return (
      <Flex
        minH="100vh"
        bg="gray.50"
        direction="column"
        align="center"
        justify="center"
        gap={2}
        py={10}
      >
        <Alert
          w="sm"
          p={8}
          status="error"
          variant="solid"
          alignItems="center"
          justifyContent="center"
        >
          <AlertIcon boxSize={10} color="red.500" />
          <Text color="red.500" fontSize="2xl" fontWeight="bold">
            {message}
          </Text>
        </Alert>
      </Flex>
    );
  }

  if (error) {
    toast({
      title: "Failed to logout",
      description: error,
      status: "error",
      isClosable: true,
    });
  }

  return (
    <Flex
      minH="100vh"
      bg="gray.50"
      direction="column"
      align="center"
      justify="center"
      gap={2}
      py={10}
    >
      <CustomBox p={8}>
        <Flex direction={"column"} gap={8}>
          <Flex gap={8}>
            <Avatar
              name={profileUser.username}
              src="" // Provide user profile pic URL if available
              size="2xl"
            />
            <Flex direction="column" gap={4}>
              <Flex justifyContent={"space-between"} gap={4}>
                <Text color="black" fontSize="2xl">
                  {profileUser.username}
                </Text>

                {loggedInUser?._id === profileUser._id ? (
                  <Flex w={"full"} gap={4}>
                    <CustomButton
                      fontSize="md"
                      color="black"
                      bg="blackAlpha.300"
                      _hover={{ bg: "blackAlpha.400" }}
                      onClick={() => navigate(`/${profileUser.username}/edit`)}
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
                ) : profileUser.followers.includes(loggedInUser!._id) ? (
                  <CustomButton
                    fontSize="md"
                    color={"black"}
                    bg={"blackAlpha.300"}
                    _hover={{ bg: "blackAlpha.400" }}
                    onClick={() => handleUnfollow()}
                  >
                    Unfollow
                  </CustomButton>
                ) : (
                  <CustomButton
                    fontSize="md"
                    color={"black"}
                    bg={"blackAlpha.300"}
                    _hover={{ bg: "blackAlpha.400" }}
                    onClick={() => handleFollow()}
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

              <Text color="black" fontSize="lg" textAlign="left">
                {profileUser.name}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </CustomBox>
    </Flex>
  );
};

export default ProfilePage;
