import React from "react";
import { useParams } from "react-router-dom";
import { Flex, Text } from "@chakra-ui/react";
import useFetchPlace from "../../common/Place/hooks/useFetchPlace";
import PlaceItem from "../../common/Place/components/PlaceItem.tsx";
import CustomSpinner from "../../common/ui/CustomSpinner.tsx";
import CustomAlert from "../../common/ui/CustomAlert.tsx";

const PlacePage: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const { place, isFetchingPlace, placeError } = useFetchPlace({
    placeId: id,
  });

  if (isFetchingPlace) return <CustomSpinner />;

  if (placeError) return <CustomAlert title={placeError.message} />;

  if (!place) {
    return <Text color={"red"}>place not found</Text>;
  }

  return (
    <Flex direction="column" gap={4} w={"2xl"}>
      <PlaceItem place={place} isDetailPage={true} />;
    </Flex>
  );
};

export default PlacePage;
