import React from "react";
import { useParams } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import useFetchMap from "../../common/Map/hooks/useFetchMap";
import MapItem from "../../common/Map/components/MapItem.tsx";
import CustomSpinner from "../../common/ui/CustomSpinner.tsx";
import CustomAlert from "../../common/ui/CustomAlert.tsx";

const MapPage: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const { map, isFetchingMap, mapError } = useFetchMap({ mapId: id });

  if (isFetchingMap) return <CustomSpinner />;

  if (mapError) return <CustomAlert title={mapError.message} />;

  if (!map) {
    return <CustomAlert title={"map not found"} />;
  }

  return (
    <Flex direction="column" gap={4} w={"2xl"}>
      <MapItem map={map} isDetailPage={true} />
    </Flex>
  );
};

export default MapPage;
