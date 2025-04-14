import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useToast, Image, Flex } from "@chakra-ui/react";
import useAddPlaceToUser from "./hooks/useAddPlaceToUser";
import { useUser } from "../../../context/UserContext";
import useFetchPlace from "./hooks/useFetchPlace";
import useRemovePlaceFromUser from "./hooks/useRemovePlaceFromUser";
import useAddPlaceLike from "./hooks/useAddPlaceLike";
import useRemovePlaceLike from "./hooks/useRemovePlaceLike";
import CardItem from "../CardItem";

interface PlaceItemProps {
  place_id: string;
}

const PlaceItem: React.FC<PlaceItemProps> = ({ place_id }) => {
  const toast = useToast();
  const { loggedInUser, setLoggedInUser } = useUser();
  const { place } = useFetchPlace({ place_id });
  const { addPlaceToUser } = useAddPlaceToUser();
  const { removePlaceFromUser } = useRemovePlaceFromUser();
  const { addPlaceLike } = useAddPlaceLike();
  const { removePlaceLike } = useRemovePlaceLike();

  const alreadyHasPlace =
    loggedInUser && loggedInUser.places.includes(place_id);

  if (!place) {
    return;
  }

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
    if (!loggedInUser) {
      toastError("Not Authorized", new Error("Please log in to like a place."));
      return;
    }
    if (place && loggedInUser && !alreadyHasPlace) {
      try {
        const payload = { placeId: place._id, userId: loggedInUser._id };
        const updatedUser = await addPlaceToUser(payload);
        setLoggedInUser(updatedUser);
        await addPlaceLike({ placeId: place._id, userId: loggedInUser._id });
      } catch (error) {
        toastError("Error Adding hooks", error as Error);
      }
    }
  };

  const handleRemovePlace = async () => {
    if (place && loggedInUser && alreadyHasPlace) {
      try {
        const payload = { placeId: place._id, userId: loggedInUser._id };
        const updatedUser = await removePlaceFromUser(payload);
        setLoggedInUser(updatedUser);
        await removePlaceLike({ placeId: place._id, userId: loggedInUser._id });
      } catch (error) {
        toastError("Error Removing hooks", error as Error);
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
      likedByUser={loggedInUser?.places.includes(place._id)}
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
