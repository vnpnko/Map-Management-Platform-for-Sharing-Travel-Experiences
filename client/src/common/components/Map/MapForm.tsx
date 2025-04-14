import React, { useState } from "react";
import { Text, Flex, Spinner, useToast } from "@chakra-ui/react";
import CustomInput from "../ui/CustomInput.tsx";
import CustomTextarea from "../ui/CustomTextarea.tsx";
import CustomButton from "../ui/CustomButton.tsx";
import PlaceForm from "../Place/PlaceForm.tsx";
import PlaceList from "../Place/PlaceList.tsx";
import { useUser } from "../../../context/UserContext.tsx";
import { useDraftMap } from "../../../context/DraftMapContext.tsx";
import useCreateMap from "../../../pages/Create/hooks/useCreateMap.ts";
import useAddMapToUser from "../../hooks/Map/useAddMapToUser.ts";
import useAddMapLike from "../../hooks/Map/useAddMapLike.ts";
import CustomBox from "../ui/CustomBox.tsx";

const MapForm: React.FC = () => {
  const toast = useToast();
  const { loggedInUser, setLoggedInUser } = useUser();
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
    likes: [loggedInUser!._id],
  };

  const handleCreateMap = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdMap = await createMap(payload);
      dispatch({ type: "SET_MAP", payload: createdMap });
      const updatedUser = await addMapToUser({
        mapId: createdMap._id,
        userId: loggedInUser!._id,
      });
      await addMapLike({ mapId: createdMap._id, userId: loggedInUser!._id });
      setLoggedInUser(updatedUser);

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
          <PlaceList items={draftMap.places} />
        )}
      </Flex>
    </CustomBox>
  );
};

export default MapForm;
