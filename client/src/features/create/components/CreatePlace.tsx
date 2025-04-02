import React from "react";
import PlaceForm from "../../places/components/PlaceForm.tsx";
import PlaceList from "../../places/components/PlaceList.tsx";
import { useUser } from "../../../context/UserContext.tsx";

const CreatePlace: React.FC = () => {
  const { loggedInUser } = useUser();
  if (!loggedInUser) {
    return;
  }

  return (
    <>
      <PlaceForm />
      <PlaceList user={loggedInUser} />
    </>
  );
};

export default CreatePlace;
