import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Image, Flex } from "@chakra-ui/react";
import useAddPlaceToUser from "./hooks/useAddPlaceToUser";
import useRemovePlaceFromUser from "./hooks/useRemovePlaceFromUser";
import useAddPlaceLike from "./hooks/useAddPlaceLike";
import useRemovePlaceLike from "./hooks/useRemovePlaceLike";
import CardItem from "../CardItem";
import { Place } from "../../../models/Place.ts";
import { useLoggedInUserStore } from "../../../store/useLoggedInUserStore.ts";
import favmaps_logo from "../../../assets/favmaps_logo.png";
import useToastError from "../../hooks/useToastError.tsx";

interface PlaceItemProps {
  place: Place;
}

const PlaceItem: React.FC<PlaceItemProps> = ({ place }) => {
  const toastError = useToastError();
  const { loggedInUser, setLoggedInUser } = useLoggedInUserStore();

  const { addPlaceToUser, isAddingPlaceToUser } = useAddPlaceToUser();
  const { removePlaceFromUser, isRemovingPlaceFromUser } =
    useRemovePlaceFromUser();
  const { addPlaceLike, isAddingPlaceLike } = useAddPlaceLike();
  const { removePlaceLike, isRemovingPlaceLike } = useRemovePlaceLike();

  const alreadyLiked = loggedInUser?.places.includes(place._id);

  const handleLikePlaceToggle = async () => {
    if (!loggedInUser) {
      toastError({
        title: "Like Failed",
        description: "Login to like places",
      });
      return;
    }

    const payload = {
      placeId: place._id,
      userId: loggedInUser._id,
    };

    try {
      const updatedUser = alreadyLiked
        ? await removePlaceFromUser(payload)
        : await addPlaceToUser(payload);

      setLoggedInUser(updatedUser);

      if (alreadyLiked) {
        await removePlaceLike(payload);
        place.likes = place.likes.filter((id) => id !== loggedInUser._id);
      } else {
        await addPlaceLike(payload);
        place.likes.push(loggedInUser._id);
      }
    } catch (error) {
      toastError({
        title: alreadyLiked ? "Unlike Failed" : "Like Failed",
        description: (error as Error).message,
      });
    }
  };

  const center = {
    lat: place.location.lat,
    lng: place.location.lng,
  };

  return (
    <CardItem
      id={place._id}
      name={place.name}
      url={place.url}
      imageUrl={place.photoUrl}
      likesCount={place.likes.length}
      // commentsCount={place.comments.length}
      likedByUser={alreadyLiked}
      onLikeToggle={handleLikePlaceToggle}
      isPending={
        isAddingPlaceLike ||
        isRemovingPlaceLike ||
        isAddingPlaceToUser ||
        isRemovingPlaceFromUser
      }
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
