import React, { useEffect } from "react";
import MapForm from "../../../common/components/Map/MapForm.tsx";
import { Map } from "../../../models/Map.ts";
import MapItem from "../../../common/components/Map/MapItem.tsx";
import GenericVirtualList from "../../../common/components/GenericVirtualList.tsx";
import { loggedInUserStore } from "../../../store/loggedInUserStore.ts";
import CustomDivider from "../../../common/components/ui/CustomDivider.tsx";
import { useMapDraftStore } from "../../../store/mapDraftStore.ts";

const CreateMap: React.FC = () => {
  const { loggedInUser } = loggedInUserStore();
  const { setMap } = useMapDraftStore();

  useEffect(() => {
    return () => setMap(null);
  }, [setMap]);

  if (loggedInUser === null) {
    return;
  }

  return (
    <>
      <MapForm />
      <CustomDivider text={"your maps"} />
      <GenericVirtualList<Map, number>
        items={[...loggedInUser.maps].reverse()}
        type={"maps"}
        pageSize={5}
        renderItem={(map) => <MapItem key={map._id} map={map} />}
      />
    </>
  );
};

export default CreateMap;
