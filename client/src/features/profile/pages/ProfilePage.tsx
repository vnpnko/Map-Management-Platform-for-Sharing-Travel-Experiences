import React from "react";
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
import CustomButton from "../../../components/common/CustomButton.tsx";
import Status from "../components/Status.tsx";
import CustomBox from "../../../components/common/CustomBox.tsx";
import { useUser } from "../../../context/UserContext.tsx";
import useLogOut from "../../auth/hooks/useLogOut.ts";
import useFollow from "../hooks/useFollow.ts";
import useUnfollow from "../hooks/useUnfollow.ts";
import PlaceList from "../../places/components/PlaceList.tsx";
import useFetchUser from "../hooks/useFetchUser.ts";

const ProfilePage: React.FC = () => {
  const { username = "" } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const { loggedInUser, setLoggedInUser } = useUser();
  const {
    fetchedUser: profileUser,
    isFetchingUser,
    userError,
  } = useFetchUser({ username });

  const { follow, isFollowing } = useFollow();
  const { unfollow, isUnfollowing } = useUnfollow();
  const { logout } = useLogOut();

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

    if (profileUser) {
      try {
        const payload = {
          followerId: loggedInUser._id,
          followeeId: profileUser._id,
        };
        const updatedUser = await follow(payload);
        setLoggedInUser(updatedUser);
        profileUser.followers.push(loggedInUser._id);
      } catch (error) {
        toast({
          title: "Follow Failed",
          description: (error as Error).message,
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  const handleUnfollow = async () => {
    if (loggedInUser && profileUser) {
      try {
        const payload = {
          followerId: loggedInUser._id,
          followeeId: profileUser._id,
        };
        const updatedUser = await unfollow(payload);
        setLoggedInUser(updatedUser);
        profileUser.followers = profileUser.followers.filter(
          (id) => id !== loggedInUser._id,
        );
      } catch (error) {
        toast({
          title: "Unfollow Failed",
          description: (error as Error).message,
          status: "error",
          isClosable: true,
        });
      }
    }
  };

  const handleLogout = () => {
    logout();
    setLoggedInUser(null);
    navigate("/");
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

  const isOwnProfile = loggedInUser && loggedInUser._id === profileUser._id;

  return (
    <Flex direction="column">
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
                <Text color="black" fontSize="2xl" textAlign="left" flex="1">
                  {profileUser.username}
                </Text>

                {isOwnProfile ? (
                  <Flex w={"full"} gap={4} flex={1}>
                    <CustomButton
                      flex={1}
                      isSelected={true}
                      onClick={() => navigate(`/${profileUser.username}/edit`)}
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
                  profileUser.followers.includes(loggedInUser._id) ? (
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
                <Status value={loggedInUser!.places.length} name="places" />
                <Status value={profileUser.followers.length} name="followers" />
                <Status value={profileUser.following.length} name="following" />
              </Flex>

              <Text
                color="black"
                fontSize="lg"
                fontWeight="medium"
                textAlign="left"
              >
                {profileUser.name}
              </Text>
            </Flex>
          </Flex>
          {isOwnProfile ? (
            <PlaceList places={loggedInUser.places} />
          ) : (
            <PlaceList places={profileUser.places} />
          )}
        </Flex>
      </CustomBox>
    </Flex>
  );
};

export default ProfilePage;
