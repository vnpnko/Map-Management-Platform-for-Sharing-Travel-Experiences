import React, { useCallback, useEffect, useRef, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { GoogleMap } from "@react-google-maps/api";

import Carousel from "../../components/Carousel";
import CustomMarker from "./CustomMarker";
import SmallPlaceItem from "../../Place/components/SmallPlaceItem";
import { Place } from "../../../models/Place";

interface MapWithPlacesProps {
  places: Place[];
}

const containerStyle = { width: "50%", height: "300px" };

const MapWithPlaces: React.FC<MapWithPlacesProps> = ({ places }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const mapRef = useRef<google.maps.Map | null>(null);

  /** fit map to all markers once the map finishes loading */
  const handleMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;

      const bounds = new google.maps.LatLngBounds();
      places.forEach((p) => bounds.extend(p.location));
      map.fitBounds(bounds, /* padding */ 100);
    },
    [places],
  );

  /** pan the map when the carousel / marker selection changes */
  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      const { lat, lng } = places[currentIndex].location;
      map.panTo({ lat, lng });
    }
  }, [currentIndex, places]);

  return (
    <Flex>
      <GoogleMap mapContainerStyle={containerStyle} onLoad={handleMapLoad}>
        {places.map((place, idx) => (
          <CustomMarker
            key={place._id}
            position={place.location}
            isCurrent={idx === currentIndex}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </GoogleMap>

      <Carousel
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
        width="50%"
        height="300px"
      >
        {places.map((place) => (
          <SmallPlaceItem key={place._id} place={place} />
        ))}
      </Carousel>
    </Flex>
  );
};

export default MapWithPlaces;
