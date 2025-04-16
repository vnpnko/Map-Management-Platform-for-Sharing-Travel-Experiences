import React, { useState } from "react";
import { Text, Flex, Spinner, useToast } from "@chakra-ui/react";
import CustomInput from "../ui/CustomInput.tsx";
import CustomTextarea from "../ui/CustomTextarea.tsx";
import CustomButton from "../ui/CustomButton.tsx";
import PlaceForm from "../Place/PlaceForm.tsx";
import { useDraftMap } from "../../../context/DraftMapContext.tsx";
import useCreateMap from "../../../pages/Create/hooks/useCreateMap.ts";
import useAddMapToUser from "./hooks/useAddMapToUser";
import useAddMapLike from "./hooks/useAddMapLike";
import CustomBox from "../ui/CustomBox";
import { Place } from "../../../models/Place.ts";
import PlaceItem from "../Place/PlaceItem.tsx";
import GenericVirtualList from "../GenericVirtualList.tsx";
import { useUserStore } from "../../../store/useUserStore.ts";

const MapForm: React.FC = () => {
  const toast = useToast();
  const { user, setUser } = useUserStore();
  const { draftMap, dispatch } = useDraftMap();
  const [mapName, setMapName] = useState("");
  const [mapDescription, setMapDescription] = useState("");

  const { createMap, isCreatingMap } = useCreateMap();
  const { addMapToUser, isAddingMapToUser } = useAddMapToUser();
  const { addMapLike } = useAddMapLike();

  const payload = {
    name: mapName,
    description: mapDescription,
    places: draftMap ? draftMap.places : [],
    likes: [user!._id],
  };

  const handleCreateMap = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdMap = await createMap(payload);
      dispatch({ type: "SET_MAP", payload: createdMap });
      const updatedUser = await addMapToUser({
        mapId: createdMap._id,
        userId: user!._id,
      });
      await addMapLike({ mapId: createdMap._id, userId: user!._id });
      setUser(updatedUser);

      dispatch({ type: "RESET" });
      setMapName("");
      setMapDescription("");
    } catch (error) {
      toast({
        title: "Failed to create map",
        description: (error as Error).message,
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <CustomBox w="full" p={4}>
      <Flex
        as="form"
        onSubmit={handleCreateMap}
        direction="column"
        gap={4}
        textColor="black"
      >
        <CustomInput
          placeholder="Map Name"
          value={mapName}
          onChange={(e) => setMapName(e.target.value)}
        />
        <CustomTextarea
          placeholder="Map Description"
          value={mapDescription}
          onChange={(e) => setMapDescription(e.target.value)}
        />
        <CustomButton type="submit" ml="auto" isSelected={false}>
          {isCreatingMap || isAddingMapToUser ? (
            <Spinner size="md" />
          ) : (
            <Text>Create Map</Text>
          )}
        </CustomButton>
      </Flex>

      <Flex direction="column" gap={4} mt={4}>
        <PlaceForm />
        {draftMap && draftMap.places.length > 0 && (
          <GenericVirtualList<Place, string>
            items={draftMap.places}
            type={"places"}
            renderItem={(place) => <PlaceItem key={place._id} place={place} />}
          />
        )}
      </Flex>
    </CustomBox>
  );
};

export default MapForm;
