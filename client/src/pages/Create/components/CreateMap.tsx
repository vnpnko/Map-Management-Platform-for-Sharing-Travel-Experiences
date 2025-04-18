import React, { useEffect } from "react";
import MapForm from "../../../common/components/Map/MapForm.tsx";
import { useDraftMap } from "../../../context/DraftMapContext.tsx";
import { Map } from "../../../models/Map.ts";
import MapItem from "../../../common/components/Map/MapItem.tsx";
import GenericVirtualList from "../../../common/components/GenericVirtualList.tsx";
import { useUserStore } from "../../../store/useUserStore.ts";
import CustomDivider from "../../../common/components/ui/CustomDivider.tsx";

const CreateMap: React.FC = () => {
  const { user } = useUserStore();
  const { dispatch } = useDraftMap();

  useEffect(() => {
    return () => {
      dispatch({ type: "RESET" });
    };
  }, [dispatch]);

  if (user === null) {
    return;
  }

  return (
    <>
      <MapForm />
      <CustomDivider text={"your maps"} mt={4} />
      <GenericVirtualList<Map, number>
        items={[...user.maps].reverse()}
        type={"maps"}
        pageSize={5}
        renderItem={(map) => <MapItem key={map._id} map={map} />}
      />
    </>
  );
};

export default CreateMap;
