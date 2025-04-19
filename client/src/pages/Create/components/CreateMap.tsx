import React, { useEffect } from "react";
import MapForm from "../../../common/components/Map/MapForm.tsx";
import { useDraftMap } from "../../../context/DraftMapContext.tsx";
import { Map } from "../../../models/Map.ts";
import MapItem from "../../../common/components/Map/MapItem.tsx";
import GenericVirtualList from "../../../common/components/GenericVirtualList.tsx";
import { useLoggedInUserStore } from "../../../store/useLoggedInUserStore.ts";
import CustomDivider from "../../../common/components/ui/CustomDivider.tsx";

const CreateMap: React.FC = () => {
  const { loggedInUser } = useLoggedInUserStore();
  const { dispatch } = useDraftMap();

  useEffect(() => {
    return () => {
      dispatch({ type: "RESET" });
    };
  }, [dispatch]);

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
