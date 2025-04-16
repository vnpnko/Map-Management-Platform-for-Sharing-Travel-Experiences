import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useToast, Image, Flex } from "@chakra-ui/react";
import useAddPlaceToUser from "./hooks/useAddPlaceToUser";
import useRemovePlaceFromUser from "./hooks/useRemovePlaceFromUser";
import useAddPlaceLike from "./hooks/useAddPlaceLike";
import useRemovePlaceLike from "./hooks/useRemovePlaceLike";
import CardItem from "../CardItem";
import { Place } from "../../../models/Place.ts";
import { useUserStore } from "../../../store/useUserStore.ts";

interface PlaceItemProps {
  place: Place;
}

const PlaceItem: React.FC<PlaceItemProps> = ({ place }) => {
  const toast = useToast();
  const { user, setUser } = useUserStore();
  const { addPlaceToUser } = useAddPlaceToUser();
  const { removePlaceFromUser } = useRemovePlaceFromUser();
  const { addPlaceLike } = useAddPlaceLike();
  const { removePlaceLike } = useRemovePlaceLike();

  const alreadyHasPlace = user?.places.includes(place._id);

  const center = {
    lat: place.location.lat,
    lng: place.location.lng,
  };

  const toastError = (title: string, error: Error) => {
    toast({
      title,
      description: error.message,
      status: "error",
      isClosable: true,
    });
  };

  const handleAddPlace = async () => {
    if (user === null) {
      toastError("Not Authorized", new Error("Please log in to like a place."));
      return;
    }
    if (place && user && !alreadyHasPlace) {
      try {
        const payload = { placeId: place._id, userId: user._id };
        const updatedUser = await addPlaceToUser(payload);
        setUser(updatedUser);
        await addPlaceLike({ placeId: place._id, userId: user._id });
        // while liking a place, we need to make a heart button unable
        place.likes.push(user._id);
      } catch (error) {
        toastError("Error Adding Place", error as Error);
      }
    }
  };

  const handleRemovePlace = async () => {
    if (place && user && alreadyHasPlace) {
      try {
        const payload = { placeId: place._id, userId: user._id };
        const updatedUser = await removePlaceFromUser(payload);
        setUser(updatedUser);
        await removePlaceLike({ placeId: place._id, userId: user._id });
        // while unliking a place, we need to make a heart button unable
        place.likes = place.likes.filter((like) => like !== user._id);
      } catch (error) {
        toastError("Error Removing PLace", error as Error);
      }
    }
  };

  return (
    <CardItem
      id={place._id}
      name={place.name}
      url={place.url}
      imageUrl={place.photoUrl}
      likesCount={place.likes.length}
      // commentsCount={place.comments.length}
      likedByUser={alreadyHasPlace}
      onLike={handleAddPlace}
      onUnlike={handleRemovePlace}
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
          src={place.photoUrl}
          alt={`${place.name} photo`}
          width={"50%"}
          height={"300px"}
          objectFit="cover"
          objectPosition={"center"}
        />
      </Flex>
    </CardItem>
  );
};

export default PlaceItem;
