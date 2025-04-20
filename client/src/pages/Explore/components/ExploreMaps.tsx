import React from "react";
import ExploreItems from "../../../common/components/ExploreItems";
import MapItem from "../../../common/Map/components/MapItem.tsx";
import { Map } from "../../../models/Map";

const ExploreMaps: React.FC = () => {
  return (
    <ExploreItems<Map, number>
      resource="maps"
      placeholder="Search maps by name or description"
      pageSize={5}
      renderItem={(map) => <MapItem key={map._id} map={map} />}
    />
  );
};

export default ExploreMaps;
