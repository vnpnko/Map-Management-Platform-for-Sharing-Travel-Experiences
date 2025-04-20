import React from "react";
import { Flex, Avatar, Text, useToast } from "@chakra-ui/react";
import CustomButton from "../ui/CustomButton.tsx";
import { User } from "../../../models/User.ts";
import useFollow from "../../../pages/Profile/hooks/useFollow.ts";
import useUnfollow from "../../../pages/Profile/hooks/useUnfollow.ts";
import CustomBox from "../ui/CustomBox.tsx";
import { useNavigate } from "react-router-dom";
import { loggedInUserStore } from "../../../store/loggedInUserStore.ts";

interface UserItemProps {
  user: User;
}

const UserItem: React.FC<UserItemProps> = ({ user }) => {
  const toast = useToast();
  const navigate = useNavigate();

  const { loggedInUser: loggedInUser, setLoggedInUser } = loggedInUserStore();
  const { follow, isFollowing } = useFollow();
  const { unfollow, isUnfollowing } = useUnfollow();

  const isOwnUser = loggedInUser && loggedInUser._id === user._id;
  const isFollowed = loggedInUser && user.followers.includes(loggedInUser._id);

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
    const payload = {
      followerId: loggedInUser._id,
      followeeId: user._id,
    };
    try {
      const data = await follow(payload);
      setLoggedInUser(data);
      user.followers.push(loggedInUser._id);
    } catch (error) {
      console.error("Follow failed:", error);
    }
  };

  const handleUnfollow = async () => {
    if (!loggedInUser) return;
    const payload = {
      followerId: loggedInUser._id,
      followeeId: user._id,
    };
    try {
      const data = await unfollow(payload);
      setLoggedInUser(data);
      user.followers = user.followers.filter((id) => id !== loggedInUser._id);
    } catch (error) {
      console.error("Unfollow failed:", error);
    }
  };

  return (
    <CustomBox
      display={"flex"}
      alignItems="center"
      justifyContent={"space-between"}
      borderBottomWidth={2}
      borderColor={"blackAlpha.300"}
      py={2}
    >
      <Flex gap={4} alignItems="center">
        <Avatar
          name={user.username}
          onClick={() => navigate(`/${user.username}`)}
          _hover={{ cursor: "pointer" }}
        />
        <Flex
          direction={"column"}
          justifyContent="center"
          alignItems="flex-start"
        >
          <Text
            fontSize="xl"
            fontWeight="medium"
            color="black"
            onClick={() => navigate(`/${user.username}`)}
            _hover={{ cursor: "pointer" }}
          >
            {user.username}
          </Text>
          <Text fontSize="md" color="blackAlpha.700">
            {user.name}
          </Text>
        </Flex>
      </Flex>
      {!isOwnUser &&
        (isFollowed ? (
          <CustomButton
            w={100}
            onClick={handleUnfollow}
            isDisabled={isUnfollowing}
            color="black"
            bg="blackAlpha.300"
            _hover={{ bg: "blackAlpha.400" }}
          >
            Unfollow
          </CustomButton>
        ) : (
          <CustomButton w={100} onClick={handleFollow} isDisabled={isFollowing}>
            Follow
          </CustomButton>
        ))}
    </CustomBox>
  );
};

export default UserItem;
