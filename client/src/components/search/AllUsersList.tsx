import React from "react";
import GenericList from "./GenericList";
import useFetchUsers from "../../hooks/useFetchUsers";
import UserItem from "../users/UserItem";
import { useUser } from "../../context/UserContext";
import { User } from "../../models/User";

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
