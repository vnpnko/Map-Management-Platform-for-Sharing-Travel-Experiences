import React, { useEffect } from "react";
import MapForm from "../../../common/components/Map/MapForm.tsx";
import { useUser } from "../../../context/UserContext.tsx";
import { useDraftMap } from "../../../context/DraftMapContext.tsx";
import { Map } from "../../../models/Map.ts";
import MapItem from "../../../common/components/Map/MapItem.tsx";
import GenericVirtualList from "../../../common/components/GenericVirtualList.tsx";

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
      <GenericVirtualList<Map, number>
        items={[...loggedInUser.maps].reverse()}
        type={"maps"}
        renderItem={(map) => <MapItem key={map._id} map={map} />}
      />
    </>
  );
};

export default CreateMap;
