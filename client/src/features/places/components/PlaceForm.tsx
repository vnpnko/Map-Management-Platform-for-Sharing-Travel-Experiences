import React, { useState, useRef } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { Box, Text, Flex, Spinner, useToast } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import CustomInput from "../../../components/common/CustomInput.tsx";
import CustomButton from "../../../components/common/CustomButton.tsx";
import useCreatePlace from "../../create/hooks/useCreatePlace.ts";
import useAddPlaceToUser from "../hooks/useAddPlaceToUser.ts";
import { useUser } from "../../../context/UserContext.tsx";
import useFetchPlace from "../hooks/useFetchPlace.ts";
import useAddPlaceLike from "../hooks/useAddPlaceLike.ts";

const libraries: "places"[] = ["places"];

const PlaceForm = () => {
  const [placeId, setPlaceId] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [placeURL, setPlaceURL] = useState("");
  const payload = {
    _id: placeId,
    name: placeName,
    url: placeURL,
    likes: [],
  };

  const toast = useToast();
  const { loggedInUser, setLoggedInUser } = useUser();
  const { place } = useFetchPlace({ place_id: placeId });

  const { addPlaceToUser, isAddingPlaceToUser } = useAddPlaceToUser();
  const { createPlace, isCreatingPlace } = useCreatePlace();
  const { addPlaceLike } = useAddPlaceLike();

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) {
    return <Text color="red.500">Error loading Google Maps API</Text>;
  }

  if (!isLoaded) {
    return (
      <Flex align="center" justify="center" minH="200px">
        <Spinner size="lg" />
      </Flex>
    );
  }

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.place_id && place.name && place.url) {
        setPlaceId(place.place_id);
        setPlaceName(place.name);
        setPlaceURL(place.url);
      }
    }
  };

  const handleCreatePlace = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let updatedUser;
      if (place) {
        updatedUser = await addPlaceToUser({
          placeId,
          userId: loggedInUser!._id,
        });
      } else {
        await createPlace(payload);
        updatedUser = await addPlaceToUser({
          placeId,
          userId: loggedInUser!._id,
        });
      }

      await addPlaceLike({ placeId: placeId, userId: loggedInUser!._id });

      setLoggedInUser(updatedUser);

      setPlaceId("");
      setPlaceName("");
      setPlaceURL("");
    } catch (error) {
      toast({
        title: "Failed to create place",
        description: (error as Error).message,
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <Flex as="form" onSubmit={handleCreatePlace} textColor={"black"}>
      <Box w={"full"} mr={4}>
        <Autocomplete
          onLoad={(autocomplete) => {
            autocompleteRef.current = autocomplete;
          }}
          onPlaceChanged={handlePlaceSelect}
        >
          <CustomInput
            w={"full"}
            placeholder="Search for a place"
            value={placeName}
            onChange={(e) => {
              setPlaceName(e.target.value);
            }}
          />
        </Autocomplete>
      </Box>
      <CustomButton type="submit" w={"min"} ml={"auto"} isSelected={false}>
        {isCreatingPlace || isAddingPlaceToUser ? (
          <Spinner size="md" />
        ) : (
          <IoMdAdd size={30} />
        )}
      </CustomButton>
    </Flex>
  );
};

export default PlaceForm;
