import React, { useState, useEffect } from "react";
import {
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  Text,
  Avatar,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../App";
import CustomButton from "../components/ui/CustomButton";
import Status from "../components/profile/Status";
import CustomBox from "../components/ui/CustomBox";
import { useUser } from "../context/UserContext";
import { User } from "../models/User";

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>("");
  const [profileUser, setProfileUser] = useState<User | null>(null);

  const navigate = useNavigate();

  const { loggedInUser, onFollow, onUnfollow } = useUser();

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

  const handleFollow = () => {
    if (loggedInUser && profileUser) {
      onFollow(profileUser);
      setProfileUser({
        ...profileUser,
        followers: [...profileUser.followers, loggedInUser._id],
      });
    }
  };

  const handleUnfollow = () => {
    if (loggedInUser && profileUser) {
      onUnfollow(profileUser);
      setProfileUser({
        ...profileUser,
        followers: profileUser.followers.filter(
          (id) => id !== loggedInUser._id,
        ),
      });
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
              <Flex gap={4}>
                <Text color="black" fontSize="2xl">
                  {profileUser.username}
                </Text>

                {loggedInUser?._id === profileUser._id ? (
                  <Flex gap={4}>
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
                      onClick={() => {
                        // handleLogout();
                        navigate(`/`);
                      }}
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
