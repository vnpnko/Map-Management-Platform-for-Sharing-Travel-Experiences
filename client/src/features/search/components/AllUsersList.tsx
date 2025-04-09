import React, { useState } from "react";
import GenericList from "./GenericList.tsx";
import useFetchUsers from "../hooks/useFetchUsers.ts";
import UserItem from "../../profile/components/UserItem.tsx";
import { useUser } from "../../../context/UserContext.tsx";
import { User } from "../../../models/User.ts";
import CustomInput from "../../../components/common/CustomInput.tsx";
import { Flex } from "@chakra-ui/react";

const AllUsersList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { users, isFetchingUsers, usersError } = useFetchUsers(searchQuery);
  const { loggedInUser } = useUser();

  return (
    <Flex direction="column" gap={4}>
      <CustomInput
        placeholder="Search users by name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <GenericList<User>
        items={users?.filter((user) => user._id !== loggedInUser?._id)}
        isLoading={isFetchingUsers}
        error={usersError}
        emptyMessage="No users available"
        renderItem={(user) => <UserItem key={user._id} user={user} />}
      />
    </Flex>
  );
};

export default AllUsersList;
