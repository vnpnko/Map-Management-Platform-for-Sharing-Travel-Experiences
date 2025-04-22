import useAddPlaceToUser from "../../User/hooks/useAddPlaceToUser.ts";
import useRemovePlaceFromUser from "../../User/hooks/useRemovePlaceFromUser.ts";
import useLikePlace from "./useLikePlace.ts";
import useUnlikePlace from "./useUnlikePlace.ts";
import { loggedInUserStore } from "../../../store/loggedInUserStore.ts";
import useToastError from "../../hooks/toast/useToastError.ts";
import { Place } from "../../../models/Place.ts";

const useToggleLikePlace = (place: Place) => {
  const { loggedInUser, setLoggedInUser } = loggedInUserStore();
  const toastError = useToastError();

  const { addPlaceToUser, isAddingPlaceToUser } = useAddPlaceToUser();
  const { removePlaceFromUser, isRemovingPlaceFromUser } =
    useRemovePlaceFromUser();
  const { likePlace, isLikingPlace } = useLikePlace();
  const { unlikePlace, isUnlikingPlace } = useUnlikePlace();

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
        await unlikePlace(payload);
        place.likes = place.likes.filter((id) => id !== loggedInUser._id);
      } else {
        await likePlace(payload);
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
    isLikingPlace ||
    isUnlikingPlace;

  return {
    alreadyLiked,
    handleToggle,
    isPending,
  };
};

export default useToggleLikePlace;
