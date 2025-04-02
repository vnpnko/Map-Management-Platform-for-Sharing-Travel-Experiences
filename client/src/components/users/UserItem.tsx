import React from "react";
import { Box, Flex, Avatar, Text, useToast } from "@chakra-ui/react";
import CustomButton from "../ui/CustomButton";
import { User } from "../../models/User";
import { useUser } from "../../context/UserContext";
import useFollow from "../../hooks/useFollow";
import useUnfollow from "../../hooks/useUnfollow";

interface UserItemProps {
  user: User;
}

const UserItem: React.FC<UserItemProps> = ({ user }) => {
  const { loggedInUser } = useUser();
  const toast = useToast();
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
      if (data) {
        // Optionally update local state or context here
        user.followers.push(loggedInUser._id);
      }
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
      if (data) {
        user.followers = user.followers.filter((id) => id !== loggedInUser._id);
      }
    } catch (error) {
      console.error("Unfollow failed:", error);
    }
  };

  return (
    <Flex alignItems="center" gap={4} p={4} boxShadow="md" borderRadius="md">
      <Avatar name={user.username} src="" />
      <Box flex="1">
        <Text fontSize="md" fontWeight="medium " color="black">
          {user.username}
        </Text>
        <Text fontSize="md" color="blackAlpha.700">
          {user.name}
        </Text>
      </Box>
      {!isOwnUser &&
        (isFollowed ? (
          <CustomButton
            flex="2"
            onClick={handleUnfollow}
            isDisabled={isUnfollowing}
            color="black"
            bg="blackAlpha.300"
            _hover={{ bg: "blackAlpha.400" }}
          >
            Unfollow
          </CustomButton>
        ) : (
          <CustomButton
            flex="2"
            onClick={handleFollow}
            isDisabled={isFollowing}
          >
            Follow
          </CustomButton>
        ))}
    </Flex>
  );
};

export default UserItem;
