import React from "react";
import GenericList from "./GenericList.tsx";
import useFetchPlaces from "../hooks/useFetchPlaces.ts";
import PlaceItem from "../../places/components/PlaceItem.tsx";
import { Place } from "../../../models/Place.ts";

const AllPlacesList: React.FC = () => {
  const { places, isFetchingPlaces, placesError } = useFetchPlaces();

  return (
    <GenericList<Place>
      items={places}
      isLoading={isFetchingPlaces}
      error={placesError}
      emptyMessage="No places available"
      renderItem={(place) => <PlaceItem key={place._id} place_id={place._id} />}
    />
  );
};

export default AllPlacesList;
