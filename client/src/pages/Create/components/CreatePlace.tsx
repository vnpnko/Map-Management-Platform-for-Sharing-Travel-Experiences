import React from "react";
import PlaceForm from "../../../common/components/Place/PlaceForm.tsx";
import { Place } from "../../../models/Place.ts";
import PlaceItem from "../../../common/components/Place/PlaceItem.tsx";
import GenericVirtualList from "../../../common/components/GenericVirtualList.tsx";
import { useUserStore } from "../../../store/useUserStore.ts";

const CreatePlace: React.FC = () => {
  const { user } = useUserStore();

  if (user === null) {
    return;
  }

  return (
    <>
      <PlaceForm />
      <GenericVirtualList<Place, string>
        items={[...user.places].reverse()}
        type={"places"}
        renderItem={(place) => <PlaceItem key={place._id} place={place} />}
      />
    </>
  );
};

export default CreatePlace;
