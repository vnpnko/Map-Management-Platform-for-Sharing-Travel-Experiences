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
import useGetUser from "../hooks/useGetUser.ts";

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();

  const navigate = useNavigate();
  const toast = useToast();

  const { loggedInUser, setLoggedInUser } = useUser();
  const { user: profileUser, isLoading, error } = useGetUser(username!);

  const { logout, error: logoutError } = useLogOut();
  const { follow, error: followError } = useFollow();
  const { unfollow, error: unfollowError } = useUnfollow();

  useEffect(() => {
    if (logoutError) {
      toast({
        title: "Logout Failed",
        description: logoutError,
        status: "error",
        isClosable: true,
      });
    }
  }, [logoutError, toast]);

  useEffect(() => {
    if (followError) {
      toast({
        title: "Follow Failed",
        description: followError,
        status: "error",
        isClosable: true,
      });
    }
  }, [followError, toast]);

  useEffect(() => {
    if (unfollowError) {
      toast({
        title: "Unfollow Failed",
        description: unfollowError,
        status: "error",
        isClosable: true,
      });
    }
  }, [unfollowError, toast]);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    await logout();
    setLoggedInUser(null);
    navigate("/");
  };

  const handleFollow = async () => {
    if (loggedInUser && profileUser) {
      const payload = {
        followerId: loggedInUser._id,
        followeeId: profileUser._id,
      };
      const data = await follow(payload);
      if (data) {
        profileUser.followers.push(loggedInUser._id);
      }
    }
  };

  const handleUnfollow = async () => {
    if (loggedInUser && profileUser) {
      const payload = {
        followerId: loggedInUser._id,
        followeeId: profileUser._id,
      };
      const data = await unfollow(payload);
      if (data) {
        profileUser.followers = profileUser.followers.filter(
          (id) => id !== loggedInUser._id,
        );
      }
    }
  };

  if (isLoading) {
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

  if (error || !profileUser) {
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
            {error ? error.message : "User not found"}
          </Text>
        </Alert>
      </Flex>
    );
  }

  const isOwnProfile = loggedInUser && loggedInUser._id === profileUser._id;

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
            <PlaceList user={profileUser} />
          </Flex>
        </Flex>
      </CustomBox>
    </Flex>
  );
};

export default ProfilePage;
