import React, { useState } from "react";
import {
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  Text,
  Avatar,
  useToast,
  Button,
  Tabs,
  TabList,
  Tab,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "../../../components/common/CustomButton.tsx";
import Status from "../components/Status.tsx";
import { useUser } from "../../../context/UserContext.tsx";
import useLogOut from "../../auth/hooks/useLogOut.ts";
import useFollow from "../hooks/useFollow.ts";
import useUnfollow from "../hooks/useUnfollow.ts";
import PlaceList from "../../places/components/PlaceList.tsx";
import useFetchUser from "../hooks/useFetchUser.ts";
import MapList from "../../maps/components/MapList.tsx";
import GoogleMapsLoader from "../../../components/common/GoogleMapsLoader.tsx";

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

  const [placesSelected, setPlacesSelected] = useState(true);

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
    <Flex
      direction="column"
      gap={8}
      maxWidth="2xl"
      w="full"
      alignItems="center"
      margin="auto"
    >
      <Flex gap={8} w={"xl"}>
        <Avatar
          name={profileUser.username}
          src="" // Provide user profile pic URL if available
          size={"2xl"}
        />
        <Flex direction="column" justifyContent={"space-between"} w={"full"}>
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Text
              color="black"
              fontSize="3xl"
              fontWeight={"thin"}
              textAlign="left"
            >
              {profileUser.username}
            </Text>

            {isOwnProfile ? (
              <Flex gap={4} alignItems={"center"}>
                <CustomButton
                  width={120}
                  isSelected={true}
                  onClick={() => navigate(`/${profileUser.username}/edit`)}
                >
                  Edit Profile
                </CustomButton>
                <Button
                  width={120}
                  textColor="black"
                  _hover={{
                    bg: "red.500",
                    textColor: "white",
                  }}
                  borderWidth={2}
                  borderColor="blackAlpha.300"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Flex>
            ) : (
              loggedInUser && (
                <CustomButton
                  width={220}
                  isSelected={true}
                  onClick={
                    profileUser.followers.includes(loggedInUser._id)
                      ? handleUnfollow
                      : handleFollow
                  }
                  isDisabled={
                    profileUser.followers.includes(loggedInUser._id)
                      ? isUnfollowing
                      : isFollowing
                  }
                >
                  {profileUser.followers.includes(loggedInUser._id)
                    ? "Unfollow"
                    : "Follow"}
                </CustomButton>
              )
            )}
          </Flex>

          <Flex justifyContent={"space-between"}>
            <Status
              value={
                isOwnProfile
                  ? loggedInUser.maps.length
                  : profileUser.maps.length
              }
              name="maps"
            />
            <Status
              value={
                isOwnProfile
                  ? loggedInUser.places.length
                  : profileUser.places.length
              }
              name="places"
            />
            <Status value={profileUser.followers.length} name="followers" />
            <Status value={profileUser.following.length} name="following" />
          </Flex>

          <Text
            color="black"
            fontSize="lg"
            fontWeight="normal"
            textAlign="left"
          >
            {profileUser.name}
          </Text>
        </Flex>
      </Flex>
      <Flex direction={"column"} gap={4} w={"full"}>
        <Tabs onChange={() => setPlacesSelected(!placesSelected)} isFitted>
          <TabList borderColor="blackAlpha.300">
            <Tab color={placesSelected ? "black" : "blackAlpha.700"}>
              Places
            </Tab>
            <Tab color={!placesSelected ? "black" : "blackAlpha.700"}>Maps</Tab>
          </TabList>
        </Tabs>
        {/*<Flex justifyContent="space-between" gap={4}>*/}
        {/*  <ToggleButton*/}
        {/*    onClick={() => {*/}
        {/*      setPlacesSelected(true);*/}
        {/*    }}*/}
        {/*    isSelected={placesSelected}*/}
        {/*  >*/}
        {/*    Places*/}
        {/*  </ToggleButton>*/}
        {/*  <ToggleButton*/}
        {/*    onClick={() => {*/}
        {/*      setPlacesSelected(false);*/}
        {/*    }}*/}
        {/*    isSelected={!placesSelected}*/}
        {/*  >*/}
        {/*    Maps*/}
        {/*  </ToggleButton>*/}
        {/*</Flex>*/}
        <GoogleMapsLoader>
          {placesSelected ? (
            isOwnProfile ? (
              <PlaceList places={loggedInUser.places} />
            ) : (
              <PlaceList places={profileUser.places} />
            )
          ) : isOwnProfile ? (
            <MapList maps={loggedInUser.maps} />
          ) : (
            <MapList maps={profileUser.maps} />
          )}
        </GoogleMapsLoader>
      </Flex>
    </Flex>
  );
};

export default ProfilePage;
