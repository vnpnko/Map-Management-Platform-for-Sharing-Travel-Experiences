import React, { useState } from "react";
import GenericList from "./GenericList.tsx";
import useFetchPlacesByName from "../hooks/useFetchPlacesByName.ts";
import PlaceItem from "../../../common/components/Place/PlaceItem.tsx";
import { Place } from "../../../models/Place.ts";
import CustomInput from "../../../common/components/ui/CustomInput.tsx";
import { Flex } from "@chakra-ui/react";

const ExplorePlaces: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { places, isFetchingPlaces, placesError } =
    useFetchPlacesByName(searchQuery);

  return (
    <Flex direction="column" gap={4}>
      <CustomInput
        placeholder="Search places by name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <GenericList<Place>
        items={places}
        isLoading={isFetchingPlaces}
        error={placesError}
        emptyMessage="No places available"
        renderItem={(place) => <PlaceItem key={place._id} place={place} />}
      />
    </Flex>
  );
};

export default ExplorePlaces;
