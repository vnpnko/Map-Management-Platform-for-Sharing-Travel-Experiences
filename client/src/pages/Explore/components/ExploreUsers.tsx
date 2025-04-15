import React, { useState } from "react";
import useFetchIds from "../../../common/hooks/useFetchIds.tsx";
import GenericVirtualList from "../../../common/components/GenericVirtualList.tsx";
import UserItem from "../../../common/components/User/UserItem.tsx";
import { User } from "../../../models/User.ts";
import CustomInput from "../../../common/components/ui/CustomInput.tsx";
import { Flex } from "@chakra-ui/react";

const ExploreUsers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data } = useFetchIds<number>("users", searchQuery);
  const userIds = data || [];

  return (
    <Flex direction="column" gap={4}>
      <CustomInput
        placeholder="Search users by name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <GenericVirtualList<User, number>
        items={userIds}
        type={"users"}
        renderItem={(user) => <UserItem key={user._id} user={user} />}
      />
    </Flex>
  );
};

export default ExploreUsers;
