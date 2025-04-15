import React, { useState } from "react";
import useFetchIds from "../../../common/hooks/useFetchIds.tsx";
import GenericVirtualList from "../../../common/components/GenericVirtualList.tsx";
import PlaceItem from "../../../common/components/Place/PlaceItem.tsx";
import { Place } from "../../../models/Place.ts";
import CustomInput from "../../../common/components/ui/CustomInput.tsx";
import { Flex } from "@chakra-ui/react";

const ExplorePlaces: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data } = useFetchIds<string>("places", searchQuery);
  const placeIds = data || [];

  return (
    <Flex direction="column" gap={4}>
      <CustomInput
        placeholder="Search places by name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <GenericVirtualList<Place, string>
        items={placeIds}
        type={"places"}
        renderItem={(place) => <PlaceItem key={place._id} place={place} />}
      />
    </Flex>
  );
};

export default ExplorePlaces;
