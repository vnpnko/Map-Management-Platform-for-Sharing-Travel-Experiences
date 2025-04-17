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
import CustomButton from "../../common/components/ui/CustomButton.tsx";
import Status from "../../common/components/User/Status.tsx";
import useFollow from "./hooks/useFollow.ts";
import useUnfollow from "./hooks/useUnfollow.ts";
import useFetchUser from "./hooks/useFetchUser.ts";
import GenericVirtualList from "../../common/components/GenericVirtualList.tsx";
import PlaceItem from "../../common/components/Place/PlaceItem.tsx";
import { Place } from "../../models/Place.ts";
import { Map } from "../../models/Map.ts";
import MapItem from "../../common/components/Map/MapItem.tsx";
import { useUserStore } from "../../store/useUserStore.ts";

const ProfilePage: React.FC = () => {
  const { username = "" } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const { user, setUser } = useUserStore();
  const {
    fetchedUser,
    isFetchingUser,
    userError,
  } = useFetchUser({ username });

  const { follow, isFollowing } = useFollow();
  const { unfollow, isUnfollowing } = useUnfollow();

  const [placesSelected, setPlacesSelected] = useState(true);

  const handleFollow = async () => {
    if (user === null) {
      toast({
        title: "Not Authorized",
        description: "Please log in to follow a user.",
        status: "error",
        isClosable: true,
      });
      return;
    }

    if (fetchedUser) {
      try {
        const payload = {
          followerId: user._id,
          followeeId: fetchedUser._id,
        };
        const updatedUser = await follow(payload);
        setUser(updatedUser);
        fetchedUser.followers.push(user._id);
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
    if (user && fetchedUser) {
      try {
        const payload = {
          followerId: user._id,
          followeeId: fetchedUser._id,
        };
        const updatedUser = await unfollow(payload);
        setUser(updatedUser);
        fetchedUser.followers = fetchedUser.followers.filter(
          (id) => id !== user._id,
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
    setUser(null);
    navigate("/");
  };

  if (isFetchingUser) {
    return <Spinner color="black" />;
  }

  if (userError || !fetchedUser) {
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

  const isOwnProfile = user && user._id === fetchedUser._id;
  const user_data = isOwnProfile ? user : fetchedUser;

  const userStats = [
    {
      name: "maps",
      value: user_data.maps.length,
    },
    {
      name: "places",
      value: user_data.places.length,
    },
    {
      name: "followers",
      value: fetchedUser.followers.length,
    },
    {
      name: "following",
      value: fetchedUser.following.length,
    },
  ];

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
          name={fetchedUser.username}
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
              {fetchedUser.username}
            </Text>

            {isOwnProfile ? (
              <Flex gap={4} alignItems={"center"}>
                <CustomButton
                  width={120}
                  isSelected={true}
                  onClick={() => navigate(`/${fetchedUser.username}/edit`)}
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
              user && (
                <CustomButton
                  width={220}
                  isSelected={true}
                  onClick={
                    fetchedUser.followers.includes(user._id)
                      ? handleUnfollow
                      : handleFollow
                  }
                  isDisabled={
                    fetchedUser.followers.includes(user._id)
                      ? isUnfollowing
                      : isFollowing
                  }
                >
                  {fetchedUser.followers.includes(user._id)
                    ? "Unfollow"
                    : "Follow"}
                </CustomButton>
              )
            )}
          </Flex>

          <Flex justifyContent={"space-between"}>
            {userStats.map((item) => (
              <Status key={item.name} value={item.value} name={item.name} />
            ))}
          </Flex>

          <Text
            color="black"
            fontSize="lg"
            fontWeight="normal"
            textAlign="left"
          >
            {fetchedUser.name}
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
        {placesSelected ? (
          <GenericVirtualList<Place, string>
            items={[...user_data.places].reverse()}
            type={"places"}
            pageSize={10}
            renderItem={(place) => <PlaceItem key={place._id} place={place} />}
          />
        ) : (
          <GenericVirtualList<Map, number>
            items={user_data.maps}
            type={"maps"}
            pageSize={5}
            renderItem={(map) => <MapItem key={map._id} map={map} />}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default ProfilePage;
