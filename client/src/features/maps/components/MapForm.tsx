import React, { useState } from "react";
import { Text, Flex, Spinner, useToast } from "@chakra-ui/react";
import CustomInput from "../../../components/common/CustomInput";
import CustomTextarea from "../../../components/common/CustomTextarea";
import CustomButton from "../../../components/common/CustomButton";
import PlaceForm from "../../places/components/PlaceForm";
import PlaceList from "../../places/components/PlaceList";
import { useUser } from "../../../context/UserContext";
import { useDraftMap } from "../../../context/DraftMapContext";
import useCreateMap from "../../create/hooks/useCreateMap";
import useAddMapToUser from "../hooks/useAddMapToUser";
import useAddMapLike from "../hooks/useAddMapLike";
import CustomBox from "../../../components/common/CustomBox";

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
        {/* PlaceForm will now update the draft map directly via its own useDraftMap calls. */}
        <PlaceForm
        // fix
        />
        {draftMap && draftMap.places.length > 0 && (
          <PlaceList places={draftMap.places} />
        )}
      </Flex>
    </CustomBox>
  );
};

export default MapForm;
