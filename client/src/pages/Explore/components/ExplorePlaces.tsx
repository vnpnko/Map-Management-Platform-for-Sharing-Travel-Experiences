import React from "react";
import ExploreItems from "../../../common/components/ExploreItems";
import PlaceItem from "../../../common/Place/components/PlaceItem.tsx";
import { Place } from "../../../models/Place";

const ExplorePlaces: React.FC = () => {
  return (
    <ExploreItems<Place, string>
      resource="places"
      placeholder="Search places by name"
      pageSize={5}
      renderItem={(place) => <PlaceItem key={place._id} place={place} />}
    />
  );
};

export default ExplorePlaces;
