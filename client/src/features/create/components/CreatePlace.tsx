import React from "react";
import PlaceForm from "../../places/components/PlaceForm.tsx";
import PlaceList from "../../places/components/PlaceList.tsx";
import { useUser } from "../../../context/UserContext.tsx";
import GoogleMapsLoader from "../../../components/common/GoogleMapsLoader.tsx";

const CreatePlace: React.FC = () => {
  const { loggedInUser } = useUser();

  if (!loggedInUser) {
    return;
  }

  return (
    <>
      <GoogleMapsLoader>
        <PlaceForm />
        <PlaceList places={[...loggedInUser.places].reverse()} />
      </GoogleMapsLoader>
    </>
  );
};

export default CreatePlace;
