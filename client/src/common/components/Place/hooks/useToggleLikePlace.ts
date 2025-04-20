import useAddPlaceToUser from "./useAddPlaceToUser";
import useRemovePlaceFromUser from "./useRemovePlaceFromUser";
import useAddPlaceLike from "./useAddPlaceLike";
import useRemovePlaceLike from "./useRemovePlaceLike";
import { loggedInUserStore } from "../../../../store/loggedInUserStore.ts";
import useToastError from "../../../hooks/useToastError.ts";
import { Place } from "../../../../models/Place";

const useToggleLikePlace = (place: Place) => {
  const { loggedInUser, setLoggedInUser } = loggedInUserStore();
  const toastError = useToastError();

  const { addPlaceToUser, isAddingPlaceToUser } = useAddPlaceToUser();
  const { removePlaceFromUser, isRemovingPlaceFromUser } =
    useRemovePlaceFromUser();
  const { addPlaceLike, isAddingPlaceLike } = useAddPlaceLike();
  const { removePlaceLike, isRemovingPlaceLike } = useRemovePlaceLike();

  const alreadyLiked = loggedInUser?.places.includes(place._id) ?? false;

  const handleToggle = async () => {
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

  const isPending =
    isAddingPlaceToUser ||
    isRemovingPlaceFromUser ||
    isAddingPlaceLike ||
    isRemovingPlaceLike;

  return {
    alreadyLiked,
    handleToggle,
    isPending,
  };
};

export default useToggleLikePlace;
