import React from "react";
import PlaceForm from "../../../common/components/Place/PlaceForm.tsx";
import PlaceList from "../../../common/components/Place/PlaceList.tsx";
import { useUser } from "../../../context/UserContext.tsx";

const CreatePlace: React.FC = () => {
  const { loggedInUser } = useUser();

  if (!loggedInUser) {
    return;
  }

  return (
    <>
      <PlaceForm />
      <PlaceList items={[...loggedInUser.places].reverse()} />
    </>
  );
};

export default CreatePlace;
