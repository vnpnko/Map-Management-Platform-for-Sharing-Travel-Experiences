import React, { useState, useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import CustomInput from "../../ui/CustomInput.tsx";
import CustomButton from "../../ui/CustomButton.tsx";
import { loggedInUserStore } from "../../../store/loggedInUserStore.ts";
import { mapDraftStore } from "../../../store/mapDraftStore.ts";
import { Place } from "../../../models/Place.ts";
import useToastError from "../../hooks/toast/useToastError.ts";
import useCreatePlace from "../../../pages/Create/hooks/useCreatePlace.ts";
import useFetchPlace from "../hooks/useFetchPlace.ts";
import useLikePlace from "../hooks/useLikePlace.ts";

interface PlaceFormProps {
  isDraftingMap?: boolean;
}

const PlaceForm: React.FC<PlaceFormProps> = ({ isDraftingMap }) => {
  const toastError = useToastError();
  const { loggedInUser, setLoggedInUser } = loggedInUserStore();
  const { addPlace } = mapDraftStore();

  const [inputValue, setInputValue] = useState("");
  const [form, setForm] = useState<Place | null>(null);
  const { place } = useFetchPlace({ placeId: form?._id ?? "" });

  const { createPlace, isCreatingPlace } = useCreatePlace();
  const { likePlace, isLikingPlace } = useLikePlace();

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  if (!loggedInUser) return null;

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const selPlace = autocompleteRef.current.getPlace();

      if (
        selPlace &&
        selPlace.place_id &&
        selPlace.name &&
        selPlace.url &&
        selPlace.geometry &&
        selPlace.geometry.location &&
        selPlace.photos &&
        selPlace.photos.length > 0
      ) {
        setForm({
          _id: selPlace.place_id,
          name: selPlace.name,
          url: selPlace.url,
          likes: [],
          location: {
            lat: selPlace.geometry.location.lat(),
            lng: selPlace.geometry.location.lng(),
          },
          photoUrl: selPlace.photos[0].getUrl(),
        });
        setInputValue(selPlace.name);
      }
    }
  };

  const handleCreatePlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) {
      setForm(null);
      toastError({
        title: "Failed to create place",
        description: "Find a place using the search bar",
      });
      return;
    }

    if (!isDraftingMap && loggedInUser.places.includes(form._id)) {
      setInputValue("");
      setForm(null);
      toastError({
        title: "Failed to create place",
        description: "Place already exists in your list",
      });
      return;
    }

    try {
      if (!place) {
        await createPlace(form);
      }
      const updatedUser = await likePlace({
        placeId: form._id,
        userId: loggedInUser._id,
      });
      setLoggedInUser(updatedUser);
      if (isDraftingMap) {
        addPlace(form._id);
      }
      setInputValue("");
      setForm(null);
    } catch {
      setInputValue("");
      setForm(null);
      toastError({
        title: "Failed to create place",
        description: "Find a place using the search bar",
      });
    }
  };

  return (
    <Flex as="form" onSubmit={handleCreatePlace} textColor="black">
      <Box w="full" mr={4}>
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={handlePlaceSelect}
        >
          <CustomInput
            w="full"
            placeholder="Search for a place"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </Autocomplete>
      </Box>
      <CustomButton type="submit" w="min" ml="auto" isSelected={false}>
        {isCreatingPlace || isLikingPlace ? (
          <Spinner size="md" />
        ) : (
          <IoMdAdd size={30} />
        )}
      </CustomButton>
    </Flex>
  );
};

export default PlaceForm;
