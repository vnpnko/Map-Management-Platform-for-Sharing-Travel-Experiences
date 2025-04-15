import React from "react";
import PlaceForm from "../../../common/components/Place/PlaceForm.tsx";
import { useUser } from "../../../context/UserContext.tsx";
import { Place } from "../../../models/Place.ts";
import PlaceItem from "../../../common/components/Place/PlaceItem.tsx";
import GenericVirtualList from "../../../common/components/GenericVirtualList.tsx";

const CreatePlace: React.FC = () => {
  const { loggedInUser } = useUser();

  if (!loggedInUser) {
    return;
  }

  return (
    <>
      <PlaceForm />
      <GenericVirtualList<Place, string>
        items={[...loggedInUser.places].reverse()}
        type={"places"}
        renderItem={(place) => <PlaceItem key={place._id} place={place} />}
      />
    </>
  );
};

export default CreatePlace;
