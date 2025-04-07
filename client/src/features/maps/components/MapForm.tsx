import React, { useState } from "react";
import { Box, Text, Flex, Spinner, useToast, VStack } from "@chakra-ui/react";
import CustomInput from "../../../components/common/CustomInput.tsx";
import CustomTextarea from "../../../components/common/CustomTextarea.tsx";
import { useUser } from "../../../context/UserContext.tsx";
import useFetchMap from "../hooks/useFetchMap.ts";
import useAddMapToUser from "../hooks/useAddMapToUser.ts";
import useAddMapLike from "../hooks/useAddMapLike.ts";
import useCreateMap from "../../create/hooks/useCreateMap.ts";
import CustomButton from "../../../components/common/CustomButton.tsx";

const MapForm = () => {
  const [mapId, setMapId] = useState(0);
  const [mapName, setMapName] = useState("");
  const [mapDescription, setMapDescription] = useState("");
  const payload = {
    name: mapName,
    description: mapDescription,
    places: [],
    likes: [],
  };

  const toast = useToast();
  const { loggedInUser, setLoggedInUser } = useUser();
  const { map } = useFetchMap({ mapId: mapId });

  const { addMapToUser, isAddingMapToUser } = useAddMapToUser();
  const { createMap, isCreatingMap } = useCreateMap();
  const { addMapLike } = useAddMapLike();

  const handleCreateMap = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let updatedUser;
      if (map) {
        updatedUser = await addMapToUser({
          mapId: mapId,
          userId: loggedInUser!._id,
        });
      } else {
        await createMap(payload);
        updatedUser = await addMapToUser({
          mapId,
          userId: loggedInUser!._id,
        });
      }

      await addMapLike({ mapId: mapId, userId: loggedInUser!._id });

      setLoggedInUser(updatedUser);

      setMapId(0);
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
    <Flex as="form" onSubmit={handleCreateMap} textColor={"black"}>
      <Box w={"full"}>
        <VStack spacing={3} align="stretch">
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
          <CustomButton type="submit" ml={"auto"} isSelected={false}>
            {isCreatingMap || isAddingMapToUser ? (
              <Spinner size="md" />
            ) : (
              <Text>Create Map</Text>
            )}
          </CustomButton>
        </VStack>
      </Box>
    </Flex>
  );
};

export default MapForm;
