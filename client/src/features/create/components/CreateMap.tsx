import React, { useEffect } from "react";
import MapForm from "../../maps/components/MapForm.tsx";
import MapList from "../../maps/components/MapList.tsx";
import { useUser } from "../../../context/UserContext.tsx";
import { useDraftMap } from "../../../context/DraftMapContext.tsx";

const CreateMap: React.FC = () => {
  const { loggedInUser } = useUser();
  const { dispatch } = useDraftMap();

  useEffect(() => {
    return () => {
      dispatch({ type: "RESET" });
    };
  }, [dispatch]);

  if (!loggedInUser) {
    return;
  }

  return (
    <>
      <MapForm />
      <MapList maps={loggedInUser.maps} />
    </>
  );
};

export default CreateMap;
