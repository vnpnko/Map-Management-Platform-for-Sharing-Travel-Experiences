import React from "react";
import { Flex } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import Status from "./components/Status.tsx";
import useFollow from "../../common/User/hooks/useFollow.ts";
import useUnfollow from "../../common/User/hooks/useUnfollow.ts";
import useFetchUser from "../../common/User/hooks/useFetchUser.ts";
import GenericVirtualList from "../../common/components/GenericVirtualList.tsx";
import ToggleButton from "../../common/ui/ToggleButton.tsx";
import { ProfileTab, useProfileTabs } from "./hooks/useProfileTabs.ts";
import { User } from "../../models/User.ts";
import { Place } from "../../models/Place.ts";
import { Map } from "../../models/Map.ts";
import UserItem from "../../common/User/components/UserItem.tsx";
import PlaceItem from "../../common/Place/components/PlaceItem.tsx";
import MapItem from "../../common/Map/components/MapItem.tsx";
import { loggedInUserStore } from "../../store/loggedInUserStore.ts";
import ProfileHeader from "./components/ProfileHeader.tsx";
import useToastError from "../../common/hooks/useToastError.ts";
import CustomSpinner from "../../common/ui/CustomSpinner.tsx";
import CustomAlert from "../../common/ui/CustomAlert.tsx";

const ProfilePage: React.FC = () => {
  const { username = "" } = useParams<{ username: string }>();
  const toastError = useToastError();

  const { loggedInUser, setLoggedInUser } = loggedInUserStore();
  const { fetchedUser, isFetchingUser, fetchedUserError } = useFetchUser({
    username,
  });
  const { follow, isFollowing } = useFollow();
  const { unfollow, isUnfollowing } = useUnfollow();
  const { activeTab, setActiveTab } = useProfileTabs();

  if (isFetchingUser) return <CustomSpinner />;

  if (fetchedUserError) return <CustomAlert title={fetchedUserError.message} />;

  if (!fetchedUser) return null;

  const isOwnProfile = loggedInUser?._id === fetchedUser._id;
  const user = isOwnProfile ? loggedInUser : fetchedUser;
  const isFollowingUser = loggedInUser
    ? fetchedUser.followers.includes(loggedInUser._id)
    : false;

  const handleFollowToggle = async () => {
    if (!loggedInUser) {
      toastError({
        title: "Follow Failed",
        description: "Login to follow users",
      });
      return;
    }

    const payload = {
      followerId: loggedInUser._id,
      followeeId: fetchedUser._id,
    };

    try {
      const updatedUser = isFollowingUser
        ? await unfollow(payload)
        : await follow(payload);
      setLoggedInUser(updatedUser);
      if (isFollowingUser) {
        fetchedUser.followers = fetchedUser.followers.filter(
          (id) => id !== loggedInUser._id,
        );
      } else {
        fetchedUser.followers.push(loggedInUser._id);
      }
    } catch (error) {
      toastError({
        title: "Follow Failed",
        description: (error as Error).message,
      });
    }
  };

  const tabMap: Record<ProfileTab, React.ReactNode> = {
    maps: (
      <GenericVirtualList<Map, number>
        items={[...user.maps].reverse()}
        type="maps"
        pageSize={5}
        renderItem={(map) => <MapItem key={map._id} map={map} />}
      />
    ),
    places: (
      <GenericVirtualList<Place, string>
        items={[...user.places].reverse()}
        type="places"
        pageSize={5}
        renderItem={(place) => <PlaceItem key={place._id} place={place} />}
      />
    ),
    followers: (
      <GenericVirtualList<User, number>
        items={[...user.followers].reverse()}
        type="users"
        pageSize={10}
        renderItem={(u) => <UserItem key={u._id} user={u} />}
      />
    ),
    following: (
      <GenericVirtualList<User, number>
        items={[...user.following].reverse()}
        type="users"
        pageSize={10}
        renderItem={(u) => <UserItem key={u._id} user={u} />}
      />
    ),
  };

  return (
    <Flex direction="column" alignItems="center" gap={8}>
      <ProfileHeader
        user={fetchedUser}
        isOwnProfile={isOwnProfile}
        isFollowingUser={isFollowingUser}
        isFollowLoading={isFollowing || isUnfollowing}
        onFollowToggle={handleFollowToggle}
      />

      <Flex direction="column" gap={4} w={"2xl"}>
        <Flex justifyContent="space-between" gap={4}>
          {(["maps", "places", "followers", "following"] as ProfileTab[]).map(
            (tab) => (
              <ToggleButton
                key={tab}
                onClick={() => setActiveTab(tab)}
                isSelected={activeTab === tab}
              >
                <Status
                  name={tab}
                  value={user[tab].length}
                  isSelected={activeTab === tab}
                />
              </ToggleButton>
            ),
          )}
        </Flex>

        {tabMap[activeTab]}
      </Flex>
    </Flex>
  );
};

export default ProfilePage;
