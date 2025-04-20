import React from "react";
import ExploreItems from "../../../common/components/ExploreItems";
import UserItem from "../../../common/components/User/UserItem";
import { User } from "../../../models/User";

const ExploreUsers: React.FC = () => {
  return (
    <ExploreItems<User, string>
      resource="users"
      placeholder="Search users by username or name"
      pageSize={10}
      renderItem={(user) => <UserItem key={user._id} user={user} />}
    />
  );
};

export default ExploreUsers;
