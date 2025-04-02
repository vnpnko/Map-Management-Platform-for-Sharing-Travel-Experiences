import MapList from "./MapList.tsx";
import React, { useState } from "react";
import CustomBox from "../../../components/common/CustomBox.tsx";
import { Button, useToast, VStack } from "@chakra-ui/react";
import CustomInput from "../../../components/common/CustomInput.tsx";
import CustomTextarea from "../../../components/common/CustomTextarea.tsx";
import { useUser } from "../../../context/UserContext.tsx";
import useFetchMap from "../hooks/useFetchMap.ts";
import useAddMapToUser from "../hooks/useAddMapToUser.ts";
import useAddMapLike from "../hooks/useAddMapLike.ts";
import useCreateMap from "../../create/hooks/useCreateMap.ts";

const MapForm = () => {
  const [mapId, setMapId] = useState();
  const [mapName, setMapName] = useState("");
  const [mapDescription, setMapDescription] = useState("");
  const payload = {
    _id: mapId,
    name: mapName,
    description: mapDescription,
    places: [],
    likes: [],
  };

  const toast = useToast();
  const { loggedInUser, setLoggedInUser } = useUser();
  const { map } = useFetchMap({ mapId });

  const { addMap, isAddingMap } = useAddMapToUser();
  const { createMap, isCreatingMap } = useCreateMap();
  const { addMapLike } = useAddMapLike();

  const handleCreateMap = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let updatedUser;
      if (map) {
        updatedUser = await addMap({ mapId: mapId, userId: loggedInUser!._id });
      } else {
        await createMap(payload);
        updatedUser = await addMap({
          mapId,
          userId: loggedInUser!._id,
        });
      }

      await addMapLike({ mapId: mapId, userId: loggedInUser!._id });

      setLoggedInUser(updatedUser);

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
    <CustomBox p={8}>
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
        <Text color={"black"} alignItems={"center"}>
          ADD PLACES
        </Text>

        <MapForm />

        <Button onClick={handleCreateMap} colorScheme="green">
          Create Map
        </Button>

        <MapList user={loggedInUser} />
      </VStack>
    </CustomBox>
  );
};

export default MapForm;
