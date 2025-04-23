// useToggleFollow.ts
import { loggedInUserStore } from "../../../store/loggedInUserStore";
import useToastError from "../../hooks/toast/useToastError";
import useLikePlace from "./useLikePlace";
import useUnlikePlace from "./useUnlikePlace";
import { Place } from "../../../models/Place";

interface TogglePayload {
  placeId: string;
  userId: number;
}

const useToggleLikePlace = (place: Place) => {
  const { loggedInUser, setLoggedInUser } = loggedInUserStore();
  const toastError = useToastError();
  const { likePlace, isLikingPlace } = useLikePlace();
  const { unlikePlace, isUnlikingPlace } = useUnlikePlace();

  const alreadyLiked = loggedInUser?.places.includes(place._id) ?? false;

  const handleToggle = async () => {
    if (!loggedInUser) {
      toastError({ title: "Like Failed", description: "Please log in first." });
      return;
    }

    const payload: TogglePayload = {
      placeId: place._id,
      userId: loggedInUser._id,
    };

    try {
      const updatedUser = alreadyLiked
        ? await unlikePlace(payload)
        : await likePlace(payload);

      // update global store
      setLoggedInUser(updatedUser);

      // reflect local UI change on place.likes
      if (alreadyLiked) {
        place.likes = place.likes.filter((id) => id !== loggedInUser._id);
      } else {
        place.likes.push(loggedInUser._id);
      }
    } catch (err) {
      toastError({
        title: alreadyLiked ? "Unlike Failed" : "Like Failed",
        description: (err as Error).message,
      });
    }
  };

  return {
    alreadyLiked,
    handleToggle,
    isPending: isLikingPlace || isUnlikingPlace,
  };
};

export default useToggleLikePlace;
