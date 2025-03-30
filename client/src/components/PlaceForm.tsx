import { useState, useRef } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import CustomInput from "./ui/CustomInput.tsx";
import CustomButton from "./ui/CustomButton.tsx";
import useCreatePlace from "../hooks/useCreatePlace.ts";
import useAddPlace from "../hooks/useAddPlace.ts";
import { useUser } from "../context/UserContext.tsx";

const libraries: "places"[] = ["places"];

const PlaceForm = () => {
  const [placeID, setPlaceID] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [placeURL, setPlaceURL] = useState("");

  const { loggedInUser } = useUser();
  const { addPlace } = useAddPlace();
  const { createPlace, isCreating } = useCreatePlace();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.place_id && place.name && place.url) {
        setPlaceID(place.place_id);
        setPlaceName(place.name);
        setPlaceURL(place.url);
      }
    }
  };

  const handleCreatePlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loggedInUser) {
      await createPlace(placeID, placeName, placeURL);
      await addPlace(placeID, loggedInUser._id);
    }
  };

  return (
    <Flex as="form" onSubmit={handleCreatePlace} textColor={"black"}>
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
      >
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
      </LoadScript>
      <CustomButton type="submit" w={"min"} ml={"auto"}>
        {isCreating ? <Spinner size="md" /> : <IoMdAdd size={30} />}
      </CustomButton>
    </Flex>
  );
};

export default PlaceForm;
