import { Flex } from "@chakra-ui/react";
import { GoogleMap } from "@react-google-maps/api";
import Carousel from "../../components/Carousel.tsx";
import CustomMarker from "./CustomMarker.tsx";
import SmallPlaceItem from "../../Place/components/SmallPlaceItem.tsx";
import { Place } from "../../../models/Place.ts";
import React, { useCallback, useState } from "react";

interface MapWithPlacesProps {
  places: Place[];
}

const MapWithPlaces: React.FC<MapWithPlacesProps> = ({ places }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleMapLoad = useCallback(
    (map: google.maps.Map) => {
      setTimeout(() => {
        const bounds = new window.google.maps.LatLngBounds();
        places.forEach((place) => {
          bounds.extend({
            lat: place.location.lat,
            lng: place.location.lng,
          });
        });
        map.fitBounds(bounds, 100);
      }, 100);
    },
    [places],
  );

  return (
    <Flex>
      <GoogleMap
        mapContainerStyle={{ width: "50%", height: "300px" }}
        onLoad={handleMapLoad}
      >
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
          <SmallPlaceItem place={place} key={place._id} />
        ))}
      </Carousel>
    </Flex>
  );
};

export default MapWithPlaces;
