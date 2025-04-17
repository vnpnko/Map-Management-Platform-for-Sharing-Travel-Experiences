import React, { useState } from "react";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import CustomInput from "./ui/CustomInput.tsx";
import GenericVirtualList from "./GenericVirtualList.tsx";
import useFetchIds from "../hooks/useFetchIds.tsx";
import useRecommendedUsers from "../../pages/Explore/hooks/useRecommendedUsers.ts";
import UserItem from "./User/UserItem.tsx";
import { User } from "../../models/User.ts";
import { useUserStore } from "../../store/useUserStore.ts";
import IconCover from "./ui/IconCover.tsx";
import { FaRegListAlt } from "react-icons/fa";

interface ExploreItemsProps<T> {
  resource: "users" | "places" | "maps";
  renderItem: (item: T) => React.ReactNode;
  placeholder: string;
  pageSize?: number;
}

const ExploreItems = <T, ID>({
  resource,
  renderItem,
  placeholder,
  pageSize = 5,
}: ExploreItemsProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(true);
  const { user } = useUserStore();
  const { data } = useFetchIds<ID>(resource, searchQuery);
  const ids = data?.filter((id) => id !== user?._id) || [];

  const { recommendedUsers, isLoadingRecommendations, recommendationError } =
    useRecommendedUsers(user?._id);

  return (
    <Flex direction="column" gap={4}>
      {user && resource === "users" && (
        <Flex bg={"green.300"} direction="column" gap={2}>
          <Flex
            justifyContent={"space-between"}
            alignItems="center"
            bg={"green.500"}
            p={2}
          >
            <Text fontWeight={"medium"}>Recommended users</Text>
            <IconCover>
              <IconButton
                aria-label={
                  isRecommendationsOpen
                    ? "Hide recommendations"
                    : "Show recommendations"
                }
                icon={<FaRegListAlt />}
                onClick={() => setIsRecommendationsOpen(!isRecommendationsOpen)}
              />
            </IconCover>
          </Flex>
          {isRecommendationsOpen && (
            <>
              {isLoadingRecommendations && <Text>Loading...</Text>}
              {recommendationError && (
                <Text color="red.500">{recommendationError.message}</Text>
              )}
              {recommendedUsers.map((user: User) => (
                <UserItem key={user._id} user={user} />
              ))}
            </>
          )}
        </Flex>
      )}

      <CustomInput
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <GenericVirtualList<T, ID>
        items={ids}
        type={resource}
        pageSize={pageSize}
        renderItem={renderItem}
      />
    </Flex>
  );
};

export default ExploreItems;
