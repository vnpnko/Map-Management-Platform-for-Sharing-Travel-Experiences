import React, { useState, useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { Box, Flex, Spinner, useToast } from "@chakra-ui/react";
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

const PlaceForm: React.FC<PlaceFormProps> = ({ onPlaceCreated }) => {
  const [placeId, setPlaceId] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [placeURL, setPlaceURL] = useState("");
  const [placeLocation, setPlaceLocation] = useState({ lat: 0, lng: 0 });
  const [formattedAddress, setFormattedAddress] = useState("");
  const [placeTypes, setPlaceTypes] = useState<string[]>([]);
  const [photoURL, setPhotoURL] = useState("");

  const payload = {
    _id: placeId,
    name: placeName,
    url: placeURL,
    likes: [],
    location: placeLocation,
    formattedAddress: formattedAddress,
    types: placeTypes,
    photoUrl: photoURL,
  };

  const toast = useToast();
  const { loggedInUser, setLoggedInUser } = useUser();
  const { dispatch } = useDraftMap();

  const { place } = useFetchPlace({ place_id: placeId });

  const { addPlaceToUser, isAddingPlaceToUser } = useAddPlaceToUser();
  const { createPlace, isCreatingPlace } = useCreatePlace();
  const { addPlaceLike } = useAddPlaceLike();

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const selPlace = autocompleteRef.current.getPlace();
      if (selPlace && selPlace.place_id && selPlace.name && selPlace.url) {
        setPlaceId(selPlace.place_id);
        setPlaceName(selPlace.name);
        setPlaceURL(selPlace.url);

        if (selPlace.geometry && selPlace.geometry.location) {
          setPlaceLocation({
            lat: selPlace.geometry.location.lat(),
            lng: selPlace.geometry.location.lng(),
          });
        }
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
        await createPlace(payload);
        updatedUser = await addPlaceToUser({
          placeId,
          userId: loggedInUser!._id,
        });
      }
      await addPlaceLike({ placeId, userId: loggedInUser!._id });
      setLoggedInUser(updatedUser);

      dispatch({ type: "ADD_PLACE", payload: placeId });

      if (onPlaceCreated) {
        onPlaceCreated(placeId);
      }

      setPlaceId("");
      setPlaceName("");
      setPlaceURL("");
      setPlaceLocation({ lat: 0, lng: 0 });
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
