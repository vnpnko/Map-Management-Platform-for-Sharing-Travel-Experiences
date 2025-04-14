import React, { useEffect } from "react";
import MapForm from "../../../common/components/Map/MapForm.tsx";
import MapList from "../../../common/components/Map/MapList.tsx";
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
      <MapList items={[...loggedInUser.maps].reverse()} />
    </>
  );
};

export default CreateMap;
