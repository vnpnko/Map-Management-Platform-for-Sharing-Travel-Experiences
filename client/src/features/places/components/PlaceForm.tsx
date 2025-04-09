import React, { useState, useRef } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { Box, Text, Flex, Spinner, useToast } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import CustomInput from "../../../components/common/CustomInput";
import CustomButton from "../../../components/common/CustomButton";
import useCreatePlace from "../../create/hooks/useCreatePlace";
import useAddPlaceToUser from "../hooks/useAddPlaceToUser";
import useFetchPlace from "../hooks/useFetchPlace";
import useAddPlaceLike from "../hooks/useAddPlaceLike";
import { useUser } from "../../../context/UserContext";
import { useDraftMap } from "../../../context/DraftMapContext";

interface PlaceFormProps {
  onPlaceCreated?: (newPlaceId: string) => void;
}

const libraries: "places"[] = ["places"];

const PlaceForm: React.FC<PlaceFormProps> = ({ onPlaceCreated }) => {
  // State for required fields
  const [placeId, setPlaceId] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [placeURL, setPlaceURL] = useState("");
  // New states for extra data
  const [placeLocation, setPlaceLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [formattedAddress, setFormattedAddress] = useState("");
  const [placeTypes, setPlaceTypes] = useState<string[]>([]);
  const [photoURL, setPhotoURL] = useState("");

  // Build payload including the additional fields.
  const payload = {
    _id: placeId,
    name: placeName,
    url: placeURL,
    likes: [],
    location: placeLocation, // Required for markers on Google Map
    formattedAddress: formattedAddress, // Human-readable address
    types: placeTypes, // Place types/categories
    photoUrl: photoURL, // URL for a photo (if available)
  };

  const toast = useToast();
  const { loggedInUser, setLoggedInUser } = useUser();
  const { dispatch } = useDraftMap();

  // This hook fetches additional place details if available.
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
      const selPlace = autocompleteRef.current.getPlace();
      if (selPlace && selPlace.place_id && selPlace.name && selPlace.url) {
        setPlaceId(selPlace.place_id);
        setPlaceName(selPlace.name);
        setPlaceURL(selPlace.url);

        // Get location (lat, lng) if available
        if (selPlace.geometry && selPlace.geometry.location) {
          setPlaceLocation({
            lat: selPlace.geometry.location.lat(),
            lng: selPlace.geometry.location.lng(),
          });
        }
        // Get formatted address if available
        if (selPlace.formatted_address) {
          setFormattedAddress(selPlace.formatted_address);
        }
        // Get types if available
        if (selPlace.types) {
          setPlaceTypes(selPlace.types);
        }
        // Get photo URL from the first photo if available
        if (selPlace.photos && selPlace.photos.length > 0) {
          setPhotoURL(selPlace.photos[0].getUrl());
        }
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
        // Create the place with the additional data
        await createPlace(payload);
        updatedUser = await addPlaceToUser({
          placeId,
          userId: loggedInUser!._id,
        });
      }
      await addPlaceLike({ placeId, userId: loggedInUser!._id });
      setLoggedInUser(updatedUser);

      // Dispatch an action to add the new place to the draft map
      dispatch({ type: "ADD_PLACE", payload: placeId });

      // Call onPlaceCreated callback if provided (for map-creation mode)
      if (onPlaceCreated) {
        onPlaceCreated(placeId);
      }

      // Reset local state.
      setPlaceId("");
      setPlaceName("");
      setPlaceURL("");
      setPlaceLocation(null);
      setFormattedAddress("");
      setPlaceTypes([]);
      setPhotoURL("");
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
    <Flex as="form" onSubmit={handleCreatePlace} textColor="black">
      <Box w="full" mr={4}>
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={handlePlaceSelect}
        >
          <CustomInput
            w="full"
            placeholder="Search for a place"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
          />
        </Autocomplete>
      </Box>
      <CustomButton
        type="submit"
        w="min"
        ml="auto"
        isSelected={false}
        disabled={!placeId}
      >
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
