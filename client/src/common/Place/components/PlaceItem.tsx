import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Image, Flex } from "@chakra-ui/react";
import CardItem from "../../components/CardItem.tsx";
import { Place } from "../../../models/Place.ts";
import favmaps_logo from "../../../assets/favmaps_logo.png";
import useToggleLikePlace from "../hooks/useToggleLikePlace.ts";

interface PlaceItemProps {
  place: Place;
}

const PlaceItem: React.FC<PlaceItemProps> = ({ place }) => {
  const { alreadyLiked, handleToggle, isPending } = useToggleLikePlace(place);

  const center = {
    lat: place.location.lat,
    lng: place.location.lng,
  };

  console.log("PlaceItem", place);

  return (
    <CardItem
      id={place._id}
      name={place.name}
      url={place.url}
      imageUrl={place.photoUrl}
      likesCount={place.likes.length}
      // commentsCount={place.comments.length}
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
          src={place.photoUrl || favmaps_logo}
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
