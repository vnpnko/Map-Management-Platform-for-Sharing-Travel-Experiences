import React from "react";
import { Flex, Text, Spinner } from "@chakra-ui/react";
import useFetchUsers from "../../hooks/useFetchUsers";
import UserItem from "../users/UserItem";
import { useUser } from "../../context/UserContext.tsx";

const AllUsersList: React.FC = () => {
  const { users, isFetchingUsers, usersError } = useFetchUsers();
  const { loggedInUser } = useUser();

  if (isFetchingUsers) {
    return (
      <Flex align="center" justify="center" minH="200px">
        <Spinner size="lg" />
      </Flex>
    );
  }

  if (usersError) {
    return (
      <Flex align="center" justify="center" minH="200px">
        <Text color="red.500">Failed to load users</Text>
      </Flex>
    );
  }

  if (!users || users.length === 0) {
    return <Text color="green">No users available</Text>;
  }

  return (
    <Flex direction="column" gap={2}>
      {users
        .filter((user) => user._id !== loggedInUser?._id)
        .map((user) => (
          <UserItem key={user._id} user={user} />
        ))}
    </Flex>
  );
};

export default AllUsersList;
