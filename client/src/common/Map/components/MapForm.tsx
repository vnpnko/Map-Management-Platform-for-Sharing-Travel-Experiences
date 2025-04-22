import React, { useState } from "react";
import { Text, Flex, Spinner } from "@chakra-ui/react";
import CustomInput from "../../ui/CustomInput.tsx";
import CustomTextarea from "../../ui/CustomTextarea.tsx";
import CustomButton from "../../ui/CustomButton.tsx";
import PlaceForm from "../../Place/components/PlaceForm.tsx";
import useCreateMap from "../../../pages/Create/hooks/useCreateMap.ts";
import useAddMapToUser from "../../User/hooks/useAddMapToUser.ts";
import useAddMapLike from "../hooks/useAddMapLike.ts";
import CustomBox from "../../ui/CustomBox.tsx";
import { Place } from "../../../models/Place.ts";
import PlaceItem from "../../Place/components/PlaceItem.tsx";
import GenericVirtualList from "../../components/GenericVirtualList.tsx";
import { loggedInUserStore } from "../../../store/loggedInUserStore.ts";
import { mapDraftStore } from "../../../store/mapDraftStore.ts";
import useToastError from "../../hooks/toast/useToastError.ts";

type FormState = {
  name: string;
  description: string;
  places: string[];
  likes: number[];
  username: string;
};

type FieldError = { type: string; message: string } | null;

const MapForm: React.FC = () => {
  const toastError = useToastError();
  const { loggedInUser, setLoggedInUser } = loggedInUserStore();
  const { mapDraft, setMapDraft } = mapDraftStore();

  const { createMap, isCreatingMap } = useCreateMap();
  const { addMapToUser, isAddingMapToUser } = useAddMapToUser();
  const { addMapLike } = useAddMapLike();

  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    places: [],
    likes: [loggedInUser!._id],
    username: loggedInUser!.username,
  });
  const [error, setError] = useState<FieldError>(null);

  const handleCreateMap = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalForm = {
      ...form,
      places: mapDraft?.places ?? [],
    };

    if (!finalForm.name.trim())
      return setError({ type: "name", message: "Map name is required" });

    if (!finalForm.description.trim())
      return setError({
        type: "description",
        message: "Map description is required",
      });

    setError(null);

    if (finalForm.places.length < 2)
      return toastError({
        title: "Failed to create map",
        description: "Map must have at least 2 places",
      });

    try {
      const createdMap = await createMap(finalForm);
      setMapDraft(createdMap);
      const updatedUser = await addMapToUser({
        mapId: createdMap._id,
        userId: loggedInUser!._id,
      });
      await addMapLike({ mapId: createdMap._id, userId: loggedInUser!._id });
      setLoggedInUser(updatedUser);
      setMapDraft(null);
    } catch (error) {
      const apiError = error as { error: string; details: string };
      toastError({
        title: apiError.error,
        description: apiError.details,
      });
    }
  };

  return (
    <CustomBox w="full">
      <Flex
        as="form"
        onSubmit={handleCreateMap}
        direction="column"
        gap={4}
        textColor="black"
      >
        <CustomInput
          placeholder="Map Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          isError={error?.type === "name"}
        />
        <CustomTextarea
          placeholder="Map Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          isError={error?.type === "description"}
        />
        <CustomButton w={"full"} type="submit" isSelected={false}>
          {isCreatingMap || isAddingMapToUser ? (
            <Spinner size="md" />
          ) : (
            <Text>Create Map</Text>
          )}
        </CustomButton>
      </Flex>

      <Flex direction="column" gap={4} mt={4}>
        <PlaceForm isDraftingMap={true} />
        {mapDraft && mapDraft.places.length > 0 && (
          <GenericVirtualList<Place, string>
            items={[...mapDraft.places].reverse()}
            type={"places"}
            pageSize={5}
            renderItem={(place) => <PlaceItem key={place._id} place={place} />}
          />
        )}
      </Flex>
    </CustomBox>
  );
};

export default MapForm;
