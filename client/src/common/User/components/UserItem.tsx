import React from "react";
import { Flex, Avatar, Text, Link } from "@chakra-ui/react";
import CustomButton from "../../ui/CustomButton.tsx";
import { User } from "../../../models/User.ts";
import CustomBox from "../../ui/CustomBox.tsx";
import { Link as RouterLink } from "react-router-dom";
import useToggleFollow from "../hooks/useToggleFollow.ts";

interface UserItemProps {
  user: User;
}

const UserItem: React.FC<UserItemProps> = ({ user }) => {
  const { alreadyFollowing, handleToggle, isPending } = useToggleFollow(user);

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
        <Link as={RouterLink} to={`/${user.username}`}>
          <Avatar name={user.username} _hover={{ cursor: "pointer" }} />
        </Link>
        <Flex direction={"column"} justifyContent="center" alignItems={"start"}>
          <Link
            as={RouterLink}
            to={`/${user.username}`}
            fontSize="lg"
            fontWeight="medium"
            color="black"
            noOfLines={0}
            w="fit-content"
            _hover={{ textDecoration: "underline" }}
          >
            {user.username}
          </Link>

          <Text fontSize="md" color="blackAlpha.700">
            {user.name}
          </Text>
        </Flex>
      </Flex>
      <CustomButton
        w={100}
        onClick={handleToggle}
        isSelected={alreadyFollowing}
        isLoading={isPending}
      >
        {alreadyFollowing ? "Unfollow" : "Follow"}
      </CustomButton>
    </CustomBox>
  );
};

export default UserItem;
