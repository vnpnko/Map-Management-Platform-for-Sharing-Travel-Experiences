import React, { useState } from "react";
import { Flex } from "@chakra-ui/react";
import CustomInput from "./ui/CustomInput.tsx";
import GenericVirtualList from "./GenericVirtualList.tsx";
import useFetchIds from "../hooks/useFetchIds.tsx";
import { useLoggedInUserStore } from "../../store/useLoggedInUserStore.ts";
import GenericRecommendationsList from "../../pages/Explore/components/GenericRecommendationsList.tsx";

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
  const { loggedInUser } = useLoggedInUserStore();
  const { data } = useFetchIds<ID>(resource, searchQuery);
  const ids = data?.filter((id) => id !== loggedInUser?._id) || [];

  return (
    <Flex direction="column" w={"full"} gap={4}>
      {loggedInUser && (
        <GenericRecommendationsList<T>
          userId={loggedInUser._id}
          resource={resource}
          renderItem={renderItem}
        />
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
