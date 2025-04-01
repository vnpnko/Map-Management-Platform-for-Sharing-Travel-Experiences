import React, { useEffect } from "react";
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
import CustomButton from "../components/ui/CustomButton";
import Status from "../components/profile/Status";
import CustomBox from "../components/ui/CustomBox";
import { useUser } from "../context/UserContext";
import useLogOut from "../hooks/useLogOut.ts";
import useFollow from "../hooks/useFollow.ts";
import useUnfollow from "../hooks/useUnfollow.ts";
import PlaceForm from "../components/PlaceForm.tsx";
import PlaceList from "../components/PlaceList.tsx";
import useFetchUser from "../hooks/useFetchUser.ts";

const ProfilePage: React.FC = () => {
  const { username = "" } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const { loggedInUser } = useUser();
  const {
    user: profileUser,
    isFetchingUser,
    userError,
  } = useFetchUser({ username });

  const { follow, isFollowing, followError } = useFollow();
  const { unfollow, isUnfollowing, unfollowError } = useUnfollow();
  const { logout } = useLogOut();

  useEffect(() => {
    if (followError) {
      toast({
        title: "Follow Failed",
        description: followError.message,
        status: "error",
        isClosable: true,
      });
    }
  }, [followError, toast]);

  useEffect(() => {
    if (unfollowError) {
      toast({
        title: "Unfollow Failed",
        description: unfollowError.message,
        status: "error",
        isClosable: true,
      });
    }
  }, [unfollowError, toast]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleFollow = async () => {
    if (!loggedInUser) {
      toast({
        title: "Not Authorized",
        description: "Please log in to follow a user.",
        status: "error",
        isClosable: true,
      });
      return;
    }

    if (loggedInUser && profileUser) {
      const payload = {
        followerId: loggedInUser._id,
        followeeId: profileUser._id,
      };
      try {
        const data = await follow(payload);
        if (data) {
          profileUser.followers.push(loggedInUser._id);
        }
      } catch (error) {
        console.error("Follow failed:", error);
      }
    }
  };

  const handleUnfollow = async () => {
    if (loggedInUser && profileUser) {
      const payload = {
        followerId: loggedInUser._id,
        followeeId: profileUser._id,
      };
      try {
        const data = await unfollow(payload);
        if (data) {
          profileUser.followers = profileUser.followers.filter(
            (id) => id !== loggedInUser._id,
          );
        }
      } catch (error) {
        console.error("Unfollow failed:", error);
      }
    }
  };

  if (isFetchingUser) {
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

  if (userError || !profileUser) {
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
            {userError?.message || "Failed to fetch user"}
          </Text>
        </Alert>
      </Flex>
    );
  }

  const isOwnProfile = loggedInUser?._id === profileUser._id;
  const userForDisplay = isOwnProfile ? loggedInUser : profileUser;

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

                {isOwnProfile ? (
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
                ) : loggedInUser &&
                  profileUser.followers.includes(loggedInUser._id) ? (
                  <CustomButton
                    fontSize="md"
                    color={"black"}
                    bg={"blackAlpha.300"}
                    _hover={{ bg: "blackAlpha.400" }}
                    onClick={handleUnfollow}
                    isDisabled={isUnfollowing}
                  >
                    Unfollow
                  </CustomButton>
                ) : (
                  <CustomButton
                    fontSize="md"
                    color={"black"}
                    bg={"blackAlpha.300"}
                    _hover={{ bg: "blackAlpha.400" }}
                    onClick={handleFollow}
                    isDisabled={isFollowing}
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
          <Flex direction={"column"} gap={4}>
            {isOwnProfile && <PlaceForm />}
            <PlaceList user={userForDisplay} />
          </Flex>
        </Flex>
      </CustomBox>
    </Flex>
  );
};

export default ProfilePage;
