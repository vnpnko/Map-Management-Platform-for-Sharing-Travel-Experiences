import React, { useState } from "react";
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
import { User } from "../../models/User.ts";
import UserItem from "../../common/components/User/UserItem.tsx";
import ToggleButton from "../../common/components/ui/ToggleButton.tsx";

const ProfilePage: React.FC = () => {
  const { username = "" } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const { user, setUser } = useUserStore();
  const { fetchedUser, isFetchingUser, userError } = useFetchUser({ username });

  const { follow, isFollowing } = useFollow();
  const { unfollow, isUnfollowing } = useUnfollow();

  const [type, setType] = useState("maps");

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

  const renderContent = () => {
    switch (type) {
      case "maps":
        return (
          <GenericVirtualList<Map, number>
            items={user_data.maps}
            type={"maps"}
            pageSize={5}
            renderItem={(map) => <MapItem key={map._id} map={map} />}
          />
        );
      case "places":
        return (
          <GenericVirtualList<Place, string>
            items={[...user_data.places].reverse()}
            type={"places"}
            pageSize={5}
            renderItem={(place) => <PlaceItem key={place._id} place={place} />}
          />
        );
      case "followers":
        return (
          <GenericVirtualList<User, number>
            items={[...user_data.followers].reverse()}
            type={"users"}
            pageSize={10}
            renderItem={(user) => <UserItem key={user._id} user={user} />}
          />
        );
      case "following":
        return (
          <GenericVirtualList<User, number>
            items={[...user_data.following].reverse()}
            type={"users"}
            pageSize={10}
            renderItem={(user) => <UserItem key={user._id} user={user} />}
          />
        );
    }
  };

  return (
    <Flex
      direction="column"
      gap={8}
      w="2xl"
      alignItems="center"
      justifyContent="center"
    >
      <Flex gap={8} w={"xl"}>
        <Avatar
          name={fetchedUser.username}
          src="" // Provide user profile pic URL if available
          size={"2xl"}
        />
        <Flex direction="column" w={"full"} justifyContent={"center"}>
          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <Text
              color="black"
              fontSize="5xl"
              fontWeight="medium"
              textAlign="left"
            >
              {fetchedUser.username}
            </Text>

            {isOwnProfile ? (
              <CustomButton
                width={120}
                height={50}
                isSelected={true}
                onClick={() => navigate(`/${fetchedUser.username}/edit`)}
              >
                Edit profile
              </CustomButton>
            ) : (
              user && (
                <CustomButton
                  width={120}
                  height={50}
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

          <Text
            color="black"
            fontSize="xl"
            fontWeight="normal"
            textAlign="left"
          >
            {fetchedUser.name}
          </Text>
        </Flex>
      </Flex>
      <Flex direction="column" gap={4} w={"2xl"}>
        <Flex justifyContent="space-between" gap={4}>
          <ToggleButton
            onClick={() => setType("maps")}
            isSelected={type === "maps"}
          >
            <Status
              value={user_data.maps.length}
              name={"maps"}
              isSelected={type === "maps"}
            />
          </ToggleButton>
          <ToggleButton
            onClick={() => setType("places")}
            isSelected={type === "places"}
          >
            <Status
              value={user_data.places.length}
              name={"places"}
              isSelected={type === "places"}
            />
          </ToggleButton>
          <ToggleButton
            onClick={() => setType("followers")}
            isSelected={type === "followers"}
          >
            <Status
              value={user_data.followers.length}
              name={"followers"}
              isSelected={type === "followers"}
            />
          </ToggleButton>
          <ToggleButton
            onClick={() => setType("following")}
            isSelected={type === "following"}
          >
            <Status
              value={user_data.following.length}
              name={"following"}
              isSelected={type === "following"}
            />
          </ToggleButton>
        </Flex>

        {renderContent()}
      </Flex>
    </Flex>
  );
};

export default ProfilePage;
