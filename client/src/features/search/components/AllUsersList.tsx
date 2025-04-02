import React from "react";
import GenericList from "./GenericList.tsx";
import useFetchUsers from "../hooks/useFetchUsers.ts";
import UserItem from "../../profile/components/UserItem.tsx";
import { useUser } from "../../../context/UserContext.tsx";
import { User } from "../../../models/User.ts";

const AllUsersList: React.FC = () => {
  const { users, isFetchingUsers, usersError } = useFetchUsers();
  const { loggedInUser } = useUser();

  return (
    <GenericList<User>
      items={users?.filter((user) => user._id !== loggedInUser?._id)}
      isLoading={isFetchingUsers}
      error={usersError}
      emptyMessage="No users available"
      renderItem={(user) => <UserItem key={user._id} user={user} />}
    />
  );
};

export default AllUsersList;
