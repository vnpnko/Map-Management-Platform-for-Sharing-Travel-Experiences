import { useState, useRef } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../App";
import { IoMdAdd } from "react-icons/io";
import CustomInput from "./ui/CustomInput.tsx";
import CustomButton from "./ui/CustomButton.tsx";

const libraries: any = ["places"];

const PlaceForm = () => {
  const [placeName, setPlaceName] = useState("");
  const [placeURL, setPlaceURL] = useState("");

  const queryClient = useQueryClient();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.name) {
        setPlaceName(place.name);
        if (place.url) {
          setPlaceURL(place.url);
        }
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
          body: JSON.stringify({ name: placeName, url: placeURL }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        setPlaceName("");
        setPlaceURL("");
        return data;
      } catch (error: any) {
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
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <Flex as="form" onSubmit={createPlace} mb={4}>
        <Box mr={2} p={0} flex={8}>
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceSelect}
          >
            <CustomInput
              placeholder="Search for a place"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
            />
          </Autocomplete>
        </Box>
        <CustomButton type="submit" flex={1}>
          {isCreating ? <Spinner size="xs" /> : <IoMdAdd size={25} />}
        </CustomButton>
      </Flex>
    </LoadScript>
  );
};

export default PlaceForm;
