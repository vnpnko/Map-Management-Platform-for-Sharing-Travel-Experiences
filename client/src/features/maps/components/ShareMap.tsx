import React from "react";
import { Button, Flex, useToast } from "@chakra-ui/react";
import { Map } from "../../../models/Map";

// Utility: Given an array of places (each with a 'location' property), generate a Google Maps Directions URL.
const generateGoogleMapsDirectionsURL = (
  places: { location: { lat: number; lng: number } }[],
): string => {
  if (places.length === 0) return "";
  // Use the first place as origin and the last as destination.
  const origin = `${places[0].location.lat},${places[0].location.lng}`;
  const destination = `${places[places.length - 1].location.lat},${places[places.length - 1].location.lng}`;

  // For places in-between, construct a waypoints string.
  let waypoints = "";
  if (places.length > 2) {
    waypoints = places
      .slice(1, -1)
      .map((p) => `${p.location.lat},${p.location.lng}`)
      .join("|");
  }
  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
  if (waypoints) {
    url += `&waypoints=${encodeURIComponent(waypoints)}`;
  }
  return url;
};

interface ShareMapProps {
  map: Map;
}

const ShareMap: React.FC<ShareMapProps> = ({ map }) => {
  const toast = useToast();

  const handleShareMap = () => {
    // Check that the map has at least one place with valid location data.
    const validPlaces = map.places.filter(
      (place: any) =>
        place.location && place.location.lat && place.location.lng,
    );
    if (validPlaces.length < 1) {
      toast({
        title: "Insufficient Data",
        description: "No valid place locations to generate a shareable map.",
        status: "warning",
        isClosable: true,
      });
      return;
    }
    const url = generateGoogleMapsDirectionsURL(validPlaces);
    if (url) {
      // Option 1: Open the URL in a new tab (which on mobile may open the Maps app)
      window.open(url, "_blank");
      // Option 2: Copy the URL to clipboard; for example:
      // navigator.clipboard.writeText(url).then(() => { ... });
    }
  };

  return (
    <Flex mt={4} justifyContent="center">
      <Button onClick={handleShareMap} colorScheme="blue">
        Share Map on Google Maps
      </Button>
    </Flex>
  );
};

export default ShareMap;
