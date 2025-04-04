import React from "react";
import MapForm from "../../maps/components/MapForm.tsx";
import MapList from "../../maps/components/MapList.tsx";
import { useUser } from "../../../context/UserContext.tsx";

const CreateMap: React.FC = () => {
  const { loggedInUser } = useUser();
  if (!loggedInUser) {
    return;
  }

  return (
    <>
      <MapForm />
      <MapList user={loggedInUser} />
    </>
  );
};

export default CreateMap;
