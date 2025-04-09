import React, { useState } from "react";
import GenericList from "./GenericList.tsx";
import useFetchPlaces from "../hooks/useFetchPlaces.ts";
import PlaceItem from "../../places/components/PlaceItem.tsx";
import { Place } from "../../../models/Place.ts";
import CustomInput from "../../../components/common/CustomInput.tsx";
import { Flex } from "@chakra-ui/react";

const AllPlacesList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { places, isFetchingPlaces, placesError } = useFetchPlaces(searchQuery);

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
        renderItem={(place) => (
          <PlaceItem key={place._id} place_id={place._id} />
        )}
      />
    </Flex>
  );
};

export default AllPlacesList;
