import React, { useState } from "react";
import { Flex } from "@chakra-ui/react";
import CustomInput from "./ui/CustomInput.tsx";
import GenericVirtualList from "./GenericVirtualList.tsx";
import useFetchIds from "../hooks/useFetchIds.tsx";
import { useUserStore } from "../../store/useUserStore.ts";
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
  const { user } = useUserStore();
  const { data } = useFetchIds<ID>(resource, searchQuery);
  const ids = data?.filter((id) => id !== user?._id) || [];

  return (
    <Flex direction="column">
      {user && (
        <GenericRecommendationsList<T>
          userId={user._id}
          resource={resource}
          renderItem={renderItem}
        />
      )}

      <CustomInput
        mt={4}
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
