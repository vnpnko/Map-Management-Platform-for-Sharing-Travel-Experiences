import React, { useEffect } from "react";
import {
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  Text,
  Avatar,
  useToast,
  Button,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "../components/ui/CustomButton";
import Status from "../components/ui/profile/Status";
import CustomBox from "../components/ui/CustomBox";
import { useUser } from "../context/UserContext";
import useLogOut from "../hooks/useLogOut.ts";
import useFollow from "../hooks/useFollow.ts";
import useUnfollow from "../hooks/useUnfollow.ts";
import PlaceList from "../components/profile/PlaceList.tsx";
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
    return <Spinner color="black" />;
  }

  if (userError || !profileUser) {
    return (
      <Alert
        p={8}
        status="error"
        variant="solid"
        alignItems="center"
        justifyContent="center"
      >
        <AlertIcon boxSize={10} color="red.500" />
        <Text color="red.500" fontSize="xl" fontWeight="bold">
          {userError?.message || "Failed to fetch user"}
        </Text>
      </Alert>
    );
  }

  const isOwnProfile = loggedInUser?._id === profileUser._id;
  const userForDisplay = isOwnProfile ? loggedInUser : profileUser;

  return (
    <Flex direction="column">
      <CustomBox p={8}>
        <Flex direction={"column"} gap={8}>
          <Flex gap={8}>
            <Avatar
              name={userForDisplay.username}
              src="" // Provide user profile pic URL if available
              size="2xl"
            />
            <Flex direction="column" gap={4}>
              <Flex justifyContent={"space-between"} gap={4}>
                <Text color="black" fontSize="2xl" textAlign="left" flex="1">
                  {userForDisplay.username}
                </Text>

                {isOwnProfile ? (
                  <Flex w={"full"} gap={4} flex={1}>
                    <CustomButton
                      flex={1}
                      isSelected={true}
                      onClick={() =>
                        navigate(`/${userForDisplay.username}/edit`)
                      }
                    >
                      Edit Profile
                    </CustomButton>
                    <Button
                      flex={1}
                      bg="gray.50"
                      textColor="black"
                      _hover={{
                        bg: "red.500",
                        textColor: "white",
                      }}
                      borderColor="blackAlpha.300"
                      borderWidth={2}
                      w={"full"}
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </Flex>
                ) : loggedInUser &&
                  userForDisplay.followers.includes(loggedInUser._id) ? (
                  <CustomButton
                    flex={1}
                    isSelected={true}
                    onClick={handleUnfollow}
                    isDisabled={isUnfollowing}
                  >
                    Unfollow
                  </CustomButton>
                ) : (
                  <CustomButton
                    flex={1}
                    isSelected={false}
                    onClick={handleFollow}
                    isDisabled={isFollowing}
                  >
                    Follow
                  </CustomButton>
                )}
              </Flex>

              <Flex gap={10}>
                <Status value={userForDisplay.places.length} name="places" />
                <Status
                  value={userForDisplay.followers.length}
                  name="followers"
                />
                <Status
                  value={userForDisplay.following.length}
                  name="following"
                />
              </Flex>

              <Text
                color="black"
                fontSize="lg"
                fontWeight="medium"
                textAlign="left"
              >
                {userForDisplay.name}
              </Text>
            </Flex>
          </Flex>
          <PlaceList user={userForDisplay} />
        </Flex>
      </CustomBox>
    </Flex>
  );
};

export default ProfilePage;
