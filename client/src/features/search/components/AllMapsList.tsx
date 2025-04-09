import React, { useState } from "react";
import GenericList from "./GenericList.tsx";
import useFetchMaps from "../hooks/useFetchMaps.ts";
import MapItem from "../../maps/components/MapItem.tsx";
import { Map } from "../../../models/Map.ts";
import { Flex } from "@chakra-ui/react";
import CustomInput from "../../../components/common/CustomInput.tsx";

const AllMapsList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { maps, isFetchingMaps, mapsError } = useFetchMaps(searchQuery);

  return (
    <Flex direction="column" gap={4}>
      <CustomInput
        placeholder="Search maps by name or description"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <GenericList<Map>
        items={maps}
        isLoading={isFetchingMaps}
        error={mapsError}
        emptyMessage="No maps available"
        renderItem={(map) => <MapItem key={map._id} map_id={map._id} />}
      />
    </Flex>
  );
};

export default AllMapsList;
