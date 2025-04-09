import React from "react";
import GenericList from "./GenericList.tsx";
import useFetchMaps from "../hooks/useFetchMaps.ts";
import MapItem from "../../maps/components/MapItem.tsx";
import { Map } from "../../../models/Map.ts";

const AllMapsList: React.FC = () => {
  const { maps, isFetchingMaps, mapsError } = useFetchMaps();

  return (
    <GenericList<Map>
      items={maps}
      isLoading={isFetchingMaps}
      error={mapsError}
      emptyMessage="No maps available"
      renderItem={(map) => <MapItem key={map._id} map_id={map._id} />}
    />
  );
};

export default AllMapsList;
