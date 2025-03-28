import React, { useState, useRef } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../App";
import { IoMdAdd } from "react-icons/io";
import CustomInput from "./ui/CustomInput.tsx";
import CustomButton from "./ui/CustomButton.tsx";

const PlaceForm = () => {
  const [placeID, setPlaceID] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [placeURL, setPlaceURL] = useState("");

  const queryClient = useQueryClient();
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

  const { mutate: createPlace, isPending: isCreating } = useMutation({
    mutationKey: ["createPlace"],
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const res = await fetch(BASE_URL + `/createPlace`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            place_id: placeID,
            name: placeName,
            url: placeURL,
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        setPlaceID("");
        setPlaceName("");
        setPlaceURL("");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["places"] });
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });

  return (
    <Flex as="form" onSubmit={createPlace} textColor={"black"}>
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={["places"]}
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
