import React from "react";
import { useParams } from "react-router-dom";
import { Text } from "@chakra-ui/react";
import useFetchMap from "../../common/Map/hooks/useFetchMap";
import MapItem from "../../common/Map/components/MapItem.tsx";
import CustomSpinner from "../../common/ui/CustomSpinner.tsx";
import CustomAlert from "../../common/ui/CustomAlert.tsx";

const MapPage: React.FC = () => {
  const { mapId = "" } = useParams<{ mapId: string }>();
  const { map, isFetchingMap, mapError } = useFetchMap({
    mapId: Number(mapId),
  });

  if (isFetchingMap) return <CustomSpinner />;

  if (mapError) return <CustomAlert title={mapError.message} />;

  if (!map) {
    return <Text color={"red"}>map not found</Text>;
  }

  return <MapItem map={map} />;
};

export default MapPage;
