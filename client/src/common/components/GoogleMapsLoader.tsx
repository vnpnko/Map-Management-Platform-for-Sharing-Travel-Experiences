import React from "react";
import { Spinner, Text, Flex } from "@chakra-ui/react";
import { useJsApiLoader } from "@react-google-maps/api";

export const GOOGLE_MAPS_LIBRARIES: ("places" | "maps")[] = ["places", "maps"];

interface GoogleMapsLoaderProps {
  children: React.ReactNode;
}

const GoogleMapsLoader: React.FC<GoogleMapsLoaderProps> = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  if (loadError) {
    return <Text color="red.500">Error loading Google Maps API.</Text>;
  }

  if (!isLoaded) {
    return (
      <Flex align="center" justify="center" minH="200px">
        <Spinner size="lg" />
      </Flex>
    );
  }

  return <>{children}</>;
};

export default GoogleMapsLoader;
