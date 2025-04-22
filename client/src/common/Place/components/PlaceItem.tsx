import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Image, Flex } from "@chakra-ui/react";
import CardItem from "../../components/CardItem.tsx";
import { Place } from "../../../models/Place.ts";
import useToggleLikePlace from "../hooks/useToggleLikePlace.ts";
import { BASE_URL } from "../../../App.tsx";

interface PlaceItemProps {
  place: Place;
  isDetailPage?: boolean;
}

const PlaceItem: React.FC<PlaceItemProps> = ({ place, isDetailPage }) => {
  const { alreadyLiked, handleToggle, isPending } = useToggleLikePlace(place);

  const center = {
    lat: place.location.lat,
    lng: place.location.lng,
  };

  return (
    <CardItem
      type={"place"}
      isDetailPage={isDetailPage}
      id={place._id}
      name={place.name}
      url={place.url}
      imageUrl={place.photoUrl}
      likesCount={place.likes.length}
      likedByUser={alreadyLiked}
      onLikeToggle={handleToggle}
      isPending={isPending}
    >
      <Flex>
        <GoogleMap
          mapContainerStyle={{
            width: "50%",
            height: "300px",
          }}
          center={center}
          zoom={10}
        >
          <Marker position={center} />
        </GoogleMap>
        <Image
          src={`${BASE_URL}/proxy/googlephoto?url=${encodeURIComponent(place.photoUrl)}`}
          alt={`${place.name} photo`}
          width={"50%"}
          height={"300px"}
          objectFit="cover"
        />
      </Flex>
    </CardItem>
  );
};

export default PlaceItem;
