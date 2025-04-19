import { Flex } from "@chakra-ui/react";
import { GoogleMap } from "@react-google-maps/api";
import Carousel from "../../Carousel";
import CustomMarker from "../CustomMarker";
import SmallPlaceItem from "../../Place/SmallPlaceItem";
import { Place } from "../../../../models/Place";
import React, { useState } from "react";

interface MapWithPlacesProps {
  places: Place[];
}

const MapWithPlaces: React.FC<MapWithPlacesProps> = ({ places }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const bounds = new window.google.maps.LatLngBounds();
  places.forEach((place) =>
    bounds.extend({ lat: place.location.lat, lng: place.location.lng }),
  );

  return (
    <Flex>
      <GoogleMap
        mapContainerStyle={{ width: "50%", height: "300px" }}
        onLoad={(map) => map.fitBounds(bounds)}
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
