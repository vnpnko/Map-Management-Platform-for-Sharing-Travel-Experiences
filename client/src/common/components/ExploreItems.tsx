import React, { useState } from "react";
import { Flex } from "@chakra-ui/react";
import CustomInput from "./ui/CustomInput.tsx";
import GenericVirtualList from "./GenericVirtualList.tsx";
import useFetchIds from "../hooks/useFetchIds.tsx";
interface ExploreItemsProps<T> {
  resource: "users" | "places" | "maps";
  renderItem: (item: T) => React.ReactNode;
  placeholder: string;
}

const ExploreItems = <T, ID>({
  resource,
  renderItem,
  placeholder,
}: ExploreItemsProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data } = useFetchIds<ID>(resource, searchQuery);
  const ids = data || [];

  return (
    <Flex direction="column" gap={4}>
      <CustomInput
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <GenericVirtualList<T, ID>
        items={ids}
        type={resource}
        renderItem={renderItem}
      />
    </Flex>
  );
};

export default ExploreItems;
